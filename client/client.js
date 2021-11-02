var net = require('net')
var client = new net.Socket()
var base64 = require('file-base64')
const readline = require('readline')
const UserHelper = require('./helper/UserHelper')
const RepositoryHelper = require('./helper/RepositoryHelper')
const FileHelper = require('./helper/FileHepler')
const CommitHelper = require('./helper/CommitHelper')
const FileCommitHelper = require('./helper/FileCommitHelper')
var fs = require('fs')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.on("close", function() {
    console.log("\nBYE BYE !!!")
    process.exit(0)
})

client.connect(1379, '127.0.0.1', function() {
	console.log('Connected')
    const message = {function: 'Hi server!;'}
	client.write(JSON.stringify(message))
})

let tempo = {}

const inRepo = client =>{
    console.log('\n1)commit and push\n2)see commits\n3)add contributor\n4)return\n5)pull\n6)get last commit\n7)download repo')

    rl.question("enter your answer :\n", function(answer) {
    
        if(answer == 1) {
            rl.question("commit message :\n", function(commitMessage) {
                rl.question("file address :\n", function(fileAddress) {
                    const path = `/${fileAddress}`
                    base64.encode(`.${path}`, function(err, base64String) {
                        const message = {function: 'COMMIT&PUSH', commitMessage, path, data: {base64String}, end: ';'}
                        client.write(JSON.stringify(message))
                    })
                    
                }) 
            })
        } 

        if( answer == 2){
            const message =  JSON.stringify({function: 'SEE COMMITS', end: ';'})
            client.write(message)
        }

        if( answer == 3){
            rl.question("Enter username which you want to add:\n", function(username) {
                const message = {function: 'ADD CONTRIBUTOR', username, end: ';'}
                client.write(JSON.stringify(message))
            })
        }

        if( answer == 4){
            Home(client)
        }

        if( answer == 5){
            pull(client)
        }

        if( answer == 6){
            client.write(JSON.stringify({function: 'GET LAST COMMIT', end: ';'}))
        }

        if( answer == 7){
            client.write(JSON.stringify({function: 'DOWNLOAD REPO', end: ';'}))
        }
    })
}

const Home = client =>{
    console.log('\n1)create repository\n2)see my repositories\n3)see all repositories\n4)go to repository')

    rl.question("enter your answer:\n", function(answer) {
        if( answer == 4 ){
            rl.question("repository name:\n", function(repositoryName) {
                const message = JSON.stringify({function: 'GO TO REPO', name: repositoryName, end: ';'})
                client.write(message)
            })
        }
        else {
            const message = JSON.stringify({function: answer == 1 ? 'CREATE REPOSITORY' : answer== 2 ? 'SEE MY REPOS' : 'SEE ALL REPOS', end: ';'})
            client.write(message)
        }
       
    })
}

const syncronization = () => {

}

const needUpdate = async () =>{
    const lastCommit = tempo.lastCommit
    
	const commit = await CommitHelper.findOne({message: lastCommit.message, username: lastCommit.username,
		createdAt: lastCommit.createdAt, repositoryId: lastCommit.repositoryId})
	
	if( !commit ) return true

	return false
}

const pull = async client =>{
   
	const update = await needUpdate()

	if( !update ) return console.log('___all files are uptodate___')

	client.write(JSON.stringify({function: 'PULL', end: ';'}))
}

const getFileFromServer = async data => {
    // console.log('data: ', data)
    // var index = data.path.indexOf('/')
	// let dir = data.path.substring(0,index+1)
    // var r = data.path.substring(index+1, data.path.length-index)
	// while( index != -1 ){
		
	
    //     console.log('r: ', r)
    //     console.log('index: ', index)
    //     console.log('dir: ', dir)
	// 	index = r.indexOf('/')
	// 	dir += r.substring(0,index+1)
    //     r = r.substring(index+1, r.length-index)

		
	// }
    // console.log('dir: ', dir)
    // console.log('r: ', data.path.substring(index+1, data.path.length-index))

	// if (!fs.existsSync(`./received${dir}`)){
		
	// 	fs.mkdirSync(`./received${dir}`)
	// }

    base64.decode(data.data.base64String, `./${data.path}`, async function(err, output) {
		console.log(`receivig file ${data.path} complete!\n`)
	})
}

const processData = async (data, client) =>{

    console.log('Server says: ' + data.message)

    if( data.message == 'Hello from server\r\n1)login\n2)signup;'){
        rl.question("enter your answer:\n", function(answer) {
            const message = {function: `${answer};`}
            client.write(JSON.stringify(message))
        })
    }
    
    if( data.message == '[LOGIN] Enter username and pasword:;' ||
        data.message == '[LOGIN]!__please enter correct username and password__!;'){
        rl.question("username:  ", function(username) {
            rl.question("password:  ", function(password) {
                tempo.username = username
                tempo.password = password
                const message = {function: 'LOGIN', data: {username, password}, end: ';'}
                client.write(JSON.stringify(message))
            })
        })
    }

    if( data.message == '[SIGNUP] Enter username and pasword:;'  ||
        data.message == '[SIGNUP]!___plesae choose another username___!;' ){
        rl.question("username:  ", function(username) {
            rl.question("password:  ", function(password) {
                tempo.username = username
                tempo.password = password
                const message = {function: 'SIGNUP', data: {username, password}, end: ';'}
                client.write(JSON.stringify(message))
            })
        })
    }

    if( data.message == '______login successfull______;' ) {
        const user = await UserHelper.findOne({username: tempo.username, password :tempo.password })
        tempo.user = user
        Home(client)
    }

    if( data.message == '______signup successfull______;' ){
        const user = await UserHelper.create(tempo.username, tempo.password)
	    tempo.user = user
        Home(client)
    }

    if( data.message == '___Create repository successfully___;' ){
        const repository = await RepositoryHelper.create(tempo.repoName, tempo.user.id, tempo.repoPublic)
        tempo.repository = repository
        Home(client)
    }

    if( data.message == '[CREATE REPOSITORY] enter repository name: ;' ||
        data.message == '!__This name of repository is already exist__!;'){
        rl.question("name :\n", function(name) {
            tempo.repoName = name
            rl.question("is repo public? :\n", function(public) {
                tempo.repoPublic = public
                const message = {function: 'CREATE REPOSITORY NAME', data: {name}, public, end: ';'}
                client.write(JSON.stringify(message))
            })
        })
    }

    if( data.message == '___IN REPO___' ){
       tempo.repository = data.repository
       inRepo(client)
    }

    if( data.message == 'LIST OF COMMITS OF THIS REPOSITORY:'){
        console.log(data.commits)
        tempo.commits = data.commits
        syncronization()
        inRepo(client)
    }

    if( data.message == '_____user added to current repository______;'){
        inRepo(client)
    }

    if( data.message == 'LIST OF YOURE REPOSITORIES'){
        console.log( data.repositories)
        Home(client)
    }

    if( data.message == '___Success commit and push___') {
        const file = await FileHelper.create(`./upload${data.path}`, tempo.repository.id)
		const commit = await CommitHelper.create(data.commitMessage,  tempo.user.username, tempo.repository.id)
		await FileCommitHelper.create(file.id, commit.id)
        inRepo(client)
    }

    if( data.message == '!__YOU DO NOT HAVE ACCESS TO THIS REPOSITORY__!'){
        inRepo(client)
    }

    if( data.message == 'LAST COMMIT' ){
        tempo.lastCommit = data.commit
        inRepo(client)
    }

    if( data.message == 'SEND FILE'){
        getFileFromServer(data)
    }
}

var chunk = ''
client.on('data', async function(data) {
  
	chunk += data.toString()
    d_index = chunk.indexOf(';')
    while (d_index > -1) {         
        try {	
            await processData(JSON.parse(chunk), client)
        }
        finally{
            chunk = ''
            d_index = chunk.indexOf(';')
        }
    }    

})

client.on('close', function() {
	console.log('Connection closed')
})
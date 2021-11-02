require('./models/index')
var net = require('net')
var base64 = require('file-base64')
const UserHelper = require('./helper/UserHelper')
const RepositoryHelper = require('./helper/RepositoryHelper')
const FileHelper = require('./helper/FileHepler')
const ContributorHelper = require('./helper/CountributorHelper')
const CommitHelper = require('./helper/CommitHelper')
const FileCommitHelper = require('./helper/FileCommitHelper')
var fs = require('fs')

const setUserId = (userId, sock) => {
	for( var i=0 ; i<sockets.length ; i++){
		if( sockets[i].port == sock.remotePort ) return sockets[i].userId = userId
	}
}

const setCurrentRepoId = (sock, currentRepoId) => {
	for( var i=0 ; i<sockets.length ; i++){
		if( sockets[i].port == sock.remotePort ) return sockets[i].currentRepoId = currentRepoId
	}
}

const findUserId = sock => {
	for( var i=0 ; i<sockets.length ; i++){
		if( sockets[i].port == sock.remotePort ) return sockets[i].userId
	}
}

const findCurrentRepoId = sock => {
	for( var i=0 ; i<sockets.length ; i++){
		if( sockets[i].port == sock.remotePort ) return sockets[i].currentRepoId	
	}
}

const signup = async (username, password, sock) => {
    let user = await UserHelper.findOne({ username })

    if( user )  return sock.write(JSON.stringify({message: '[SIGNUP]!___plesae choose another username___!;'}))

    user = await UserHelper.create(username, password)

	setUserId(user.id, sock)

	return sock.write(JSON.stringify({message: '______signup successfull______;'}))   
}

const login = async (username, password, sock) => {
    let user = await UserHelper.findOne({ username, password })

    if (!user) return sock.write(JSON.stringify({message: '[LOGIN]!__please enter correct username and password__!;'}))

	console.log('userId: ', user.id)
	
	setUserId(user.id, sock)
    
    return sock.write(JSON.stringify({message: '______login successfull______;'}))
}

const createRepository = async(name, public, sock) => {

	let repository = await RepositoryHelper.findOne({name})

	if( repository ) return sock.write(JSON.stringify({message: '!__This name of repository is already exist__!;'}))

	repository = await RepositoryHelper.create(name, findUserId(sock), public)
	return sock.write(JSON.stringify({message: '___Create repository successfully___;'}))
}

const seeMyRrepos = async(sock) => {
	const userId = findUserId(sock)
	const contributors = await ContributorHelper.findAll({userId})
	let repositories = []
	for( var i=0 ; i<contributors.length ; i++){
		const repository = await RepositoryHelper.findOne({id: contributors[i].repositoryId})
		repositories.push(repository.name)
	}

	const msg = { message: 'LIST OF YOURE REPOSITORIES', repositories, end: ';' }
	sock.write(JSON.stringify(msg))
}

const checkAccess = async (userId, repositoryId)=>{
	const contributor = await ContributorHelper.findOne({userId, repositoryId})
	if( !contributor )	return false

	return true
}

const commitAndPush = async (base64String, message, path, sock) => {
	const user = await UserHelper.findOne({id: findUserId(sock)})
	const repoId = findCurrentRepoId(sock)

	const access = await checkAccess(user.id, repoId)
	console.log('path: ', path)

	
	var index = path.indexOf('/')
	let dir = path.substring(0,index+1)
	while( index != -1 ){
		
		var r = path.substring(index+1, path.length-index)
		index = r.indexOf('/')
		dir += r.substring(0,index+1)

		console.log('dir: ', dir)
		console.log('index: ', path.indexOf('/'))
	}

	if (!fs.existsSync(`./received${dir}`)){
		
		fs.mkdirSync(`./received${dir}`)
	}

	if( !access ) 
		return sock.write(JSON.stringify({message: '!__YOU DO NOT HAVE ACCESS TO THIS REPOSITORY__!', end: ';'}))
	
	base64.decode(base64String, `./received${path}`, async function(err, output) {
		const file = await FileHelper.create(`./received${path}`, findCurrentRepoId(sock))
		const commit = await CommitHelper.create(message, user.username, repoId)
		await FileCommitHelper.create(file.id, commit.id)

		sock.write(JSON.stringify({message: '___Success commit and push___', path, commitMessage: message, end: ';'}))
	})
	
}

const goToRepo = async (name, sock) =>{
	const repository = await RepositoryHelper.findOne({name})
	setCurrentRepoId(sock, repository.id)
	sock.write(JSON.stringify({message: '___IN REPO___', repository , end: ';'}))
}

const addContributor = async(username, sock) => {
	const user = await UserHelper.findOne({username})
	await ContributorHelper.create(user.id, findCurrentRepoId(sock) )
	sock.write(JSON.stringify({message: `_____user added to current repository______;`}))
}

const seeCommits = async sock =>{

	const user = await UserHelper.findOne({id: findUserId(sock)})
	const repoId = findCurrentRepoId(sock)

	const repository = await RepositoryHelper.findOne({id: repoId})
	const access = await checkAccess(user.id, repoId)

	if( !access  && !repository.public) 
		return sock.write(JSON.stringify({message: '!__YOU DO NOT HAVE ACCESS TO THIS REPOSITORY__!', end: ';'}))
	

	let commits = await CommitHelper.findAll({repositoryId: findCurrentRepoId(sock)})
	const msg = {message: 'LIST OF COMMITS OF THIS REPOSITORY:', commits, end: ';'}
	sock.write(JSON.stringify(msg))
}

const pull = async sock =>{

	const files = await FileHelper.findAll({repositoryId: findCurrentRepoId(sock)})
	

	for( var i=0 ; i<files.length ; i++){
		const path = files[i].path
		console.log('path is: ', path)
		const pathToSend = path.substr(10)

		base64.encode(path, function(err, base64String) {
			const message = {message: 'SEND FILE', path: pathToSend, data: {base64String}, end: ';'}
			sock.write(JSON.stringify(message))
		})
	}	
}


var server = net.createServer()

let sockets = [] 

server.listen(1379, '127.0.0.1')

const processData = async (message, sock) =>{
	console.log('client: ', message.function)
	if( message.function == 'Hi server!;'){
		return sock.write(JSON.stringify({message: 'Hello from server\r\n1)login\n2)signup;'}))
	}

	if( message.function == 'login;'){
		return sock.write(JSON.stringify({message: '[LOGIN] Enter username and pasword:;'}))
	}

	if( message.function == 'signup;'){
		return sock.write(JSON.stringify({message: '[SIGNUP] Enter username and pasword:;'}))
	}

	if( message.function == 'LOGIN'){
		await login(message.data.username, message.data.password, sock)
	}

	if( message.function == 'SIGNUP'){
		await signup(message.data.username, message.data.password, sock)
	}

	if( message.function == 'CREATE REPOSITORY'){
		sock.write(JSON.stringify({message: '[CREATE REPOSITORY] enter repository name: ;'}))
	}

	if( message.function == 'CREATE REPOSITORY NAME'){
		createRepository(message.data.name, message.public, sock)
	}

	if( message.function == 'COMMIT&PUSH'){
		const base64String = message.data.base64String
		await commitAndPush(base64String, message.commitMessage , message.path, sock)
	}

	if( message.function == 'SEE MY REPOS'){
		seeMyRrepos(sock)
	}

	if( message.function == 'SEE ALL REPOS'){

	}

	if( message.function == 'GO TO REPO'){
		await goToRepo(message.name, sock)
	}

	if( message.function == 'ADD CONTRIBUTOR'){
		addContributor(message.username, sock)
	}

	if( message.function == 'SEE COMMITS'){
		seeCommits(sock)
	}

	if( message.function == 'PULL'){
		pull(sock)
	}

	if( message.function == 'GET LAST COMMIT'){
		const commit = await CommitHelper.findLastOne(findCurrentRepoId(sock))
		sock.write(JSON.stringify({message: 'LAST COMMIT', commit: commit[0], end: ';'}))
	}

	if( message.function == 'DOWNLOAD REPO'){
		pull(sock)
	}
}

server.on('connection', function(sock) {

    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort)
    sockets.push( {port: sock.remotePort})

	var chunk = ""

	sock.on('data', async function(data) {
		
		chunk += data.toString()
		d_index = chunk.indexOf(';')
		while (d_index > -1) {         
			try {	
				await processData(JSON.parse(chunk), sock)
			}
			finally{
				chunk = ''
				d_index = chunk.indexOf(';')
			}
		
		}    
		
	})

	sock.on('close', function(){
		console.log('client closed')
	})

	sock.on('error', function(){
		console.log('client error')
	})
	
})
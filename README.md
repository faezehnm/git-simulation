# Git Sim
## _basic simulation of git_

This project is a simulation of git . People can create an account with a unique ID and log in to their account. Each user can create their own repository and commit their files in their local repository and then push them in the remote repository. Users can work on a repository at the same time and can See also other repositories if they are public. users can see history of commits in a repository as well as the possibility of pull and clone.

## Features:
- login & signup
- create reposotory, commit and push files & directories
- see all available repositories if their are public
- contribute in a shared repository with other users
- clone a repository which is public
- pull and update repository before push


The project includes a server and a client. The server is designed to be able to handle the requests of multiple clients at the same time.

## Installation

Dillinger requires [Node.js](https://nodejs.org/) to run.

Install the dependencies and devDependencies of server:

```sh
cd server
npm i
```

create database in server side (migrations are available in the project but you need to set your own envienment in .env file) :
```sh
sequelize db:create 
sequelize db:migrate  
```

and then start server:
```sh
npm start 
```

Install the dependencies and devDependencies of client:
```sh
cd client
npm i
```

create database in client side (migrations are available in the project but you need to set your own envienment in .env file) :
```sh
sequelize db:create 
sequelize db:migrate  
```

and then start client:
```sh
npm start 
```


## License

MIT

**Hope you enjoy :)**

const db = require('../models')

const findOne = async (where = {}) => {
  const commit = await db.Commit.findOne({
    where: where
  })

  return commit
}

const create = async (message, username, repositoryId) => {
  let commit =  await db.Commit.create({
    message,
    username,
    repositoryId
  })
  
  return commit.get({plain:true})
}

const findAll = async (where = {}) => {
  const commits = await db.Commit.findAll({
    where: where,
    raw: true,
    attributes: ['message', 'username', 'updatedAt' , 'createdAt']
  })
  
  return commits
}

const findLastOne = async repositoryId =>{
  const commit = db.Commit.findAll({
    limit: 1,
    where: {
      repositoryId
    },
    order: [ [ 'createdAt', 'DESC' ]],
    raw: true
    })

    return commit
}

module.exports = { findOne, create, findAll, findLastOne }

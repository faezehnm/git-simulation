const db = require('../models')

const findOne = async (where = {}) => {
  const fileCommit = await db.FileCommit.findOne({
    where: where,
    raw: true
  })

  return fileCommit
}

const create = async (fileId, commitId) => {
  let fileCommit =  await db.FileCommit.create({
    fileId,
    commitId
  })
  
  return fileCommit.get({plain:true})
}

module.exports = { findOne, create }

const db = require('../models')

const findOne = async (where = {}) => {
  const File = await db.File.findOne({
    where: where
  })

  return File
}

const create = async (path, repositoryId) => {
  const File = await db.File.create({
    path,
    repositoryId
  })
 return File.get({plain:true})
}

module.exports = { findOne, create }

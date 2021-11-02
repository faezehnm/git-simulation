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

const findAll = async (where = {}) => {
  const files = await db.File.findAll({
    where: where,
    raw: true,
  })
  
  return files
}

module.exports = { findOne, create, findAll }

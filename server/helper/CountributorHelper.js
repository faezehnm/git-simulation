const db = require('../models')

const findOne = async (where = {}) => {
  const contributor = await db.Contributor.findOne({
    where: where
  })

  return contributor
}

const create = async (userId, repositoryId) => {
  const contributor = await db.Contributor.create({
    userId,
    repositoryId
  })
  return contributor.get({plain:true})
}

const findAll = async (where = {}) => {
  const contributors = await db.Contributor.findAll({
    where: where,
    raw: true
  })
  
  return contributors
}

module.exports = { findOne, create, findAll }

const db = require('../models')

const findOne = async (where = {}) => {
  const repository = await db.Repository.findOne({
    where: where,
    raw: true
  })

  return repository
}

const create = async (name, userId, public) => {
  const repository = await db.Repository.create({
    name, userId, public
  })

  await db.Contributor.create({
    repositoryId: repository.id,
    userId
  })

  return repository
}

module.exports = { findOne, create }

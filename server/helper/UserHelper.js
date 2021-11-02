const db = require('../models')

const findOne = async (where = {}) => {
  const user = await db.User.findOne({
    where: where,
    raw: true
  })

  return user
}

const create = async (username, password) => {
  const user = await db.User.create({
    username,
    password
  })
  return user
}

module.exports = { findOne, create }

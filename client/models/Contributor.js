'use strict'

module.exports = (sequelize, DataTypes) => {
  const Contributor = sequelize.define('Contributor', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    userId: DataTypes.INTEGER,
    repositoryId: DataTypes.INTEGER
  })

  Contributor.associate = models => {
    Contributor.belongsTo(models.User)
    Contributor.belongsTo(models.Repository)
    models.User.hasMany(Contributor)
    models.Repository.hasMany(Contributor)
  }

  return Contributor
}

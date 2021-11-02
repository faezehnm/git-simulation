'use strict'

module.exports = (sequelize, DataTypes) => {
  const Directory = sequelize.define('Directory', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING
  })

  Directory.associate = models => {
    Directory.belongsToMany(models.Commit, { through: models.DirectoryCommit })
  }

  return Directory
}

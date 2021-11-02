'use strict'

module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    path: DataTypes.STRING,
    directoryId: DataTypes.INTEGER,
    repositoryId: DataTypes.INTEGER
  })

  File.associate = models => {
    File.belongsToMany(models.Commit, { through: models.FileCommit })
  }

  return File
}

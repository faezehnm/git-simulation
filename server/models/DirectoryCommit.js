'use strict'

module.exports = (sequelize, DataTypes) => {
  const DirectoryCommit = sequelize.define('DirectoryCommit', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    directoryId: DataTypes.INTEGER,
    commitId: DataTypes.INTEGER
  })

  DirectoryCommit.associate = models => {
    DirectoryCommit.belongsTo(models.Directory)
    DirectoryCommit.belongsTo(models.Commit)
    models.Directory.hasMany(DirectoryCommit)
    models.Commit.hasMany(DirectoryCommit)
  }

  return DirectoryCommit
}

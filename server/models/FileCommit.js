'use strict'

module.exports = (sequelize, DataTypes) => {
  const FileCommit = sequelize.define('FileCommit', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    fileId: DataTypes.INTEGER,
    commitId: DataTypes.INTEGER
  })

  FileCommit.associate = models => {
    FileCommit.belongsTo(models.File)
    FileCommit.belongsTo(models.Commit)
    models.File.hasMany(FileCommit)
    models.Commit.hasMany(FileCommit)
  }

  return FileCommit
}

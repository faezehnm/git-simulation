'use strict'

module.exports = (sequelize, DataTypes) => {
  const Commit = sequelize.define('Commit', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    message: {
        type: DataTypes.STRING
    },
    username: DataTypes.STRING,
    repositoryId : DataTypes.INTEGER
    
  })

  Commit.associate = models => {
    Commit.belongsTo(models.Repository)
    models.Repository.hasMany(Commit)
    Commit.belongsToMany(models.Directory, { through: models.DirectoryCommit })
    Commit.belongsToMany(models.File, { through: models.FileCommit })
  }

  return Commit
}

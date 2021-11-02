'use strict'

module.exports = (sequelize, DataTypes) => {
  const Repository = sequelize.define('Repository', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    public: DataTypes.BOOLEAN
  })

  Repository.associate = models => {
    Repository.belongsToMany(models.User, { through: models.Contributor })
  }

  return Repository
}

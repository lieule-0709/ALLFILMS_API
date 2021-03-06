
module.exports = (sequelize, DataTypes) => {
  const Cinema = sequelize.define('Cinema', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: DataTypes.STRING,
    address: DataTypes.STRING
  }, {
    tablename: 'cinemas',
    underscored: true
  });

  // eslint-disable-next-line no-unused-vars
  Cinema.associate = (models) => {
    Cinema.hasMany(models.Session);
    Cinema.hasMany(models.Room);
  };

  return Cinema;
};

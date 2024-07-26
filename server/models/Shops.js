module.exports = (sequelize, DataTypes) => {
    const Shops = sequelize.define('Shops', {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      }
    });
  
    return Shops;
  };
  
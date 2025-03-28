const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CustomerPhone extends Model {
    static associate(models) {
      CustomerPhone.belongsTo(models.Customer, {
        foreignKey: 'CustomerID',
        as: 'customer'
      });
      CustomerPhone.hasMany(models.IncomingMessage, {
        foreignKey: 'PhoneID',
        as: 'incomingMessages'
      });
      CustomerPhone.hasMany(models.OutgoingMessage, {
        foreignKey: 'PhoneID',
        as: 'outgoingMessages'
      });
    }
  }

  CustomerPhone.init({
    PhoneID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    CustomerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'CustomerID'
      }
    },
    WhatsAppNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    PhoneType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'personal'
    },
    IsActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'CustomerPhone',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
    underscored: false
  });

  return CustomerPhone;
}
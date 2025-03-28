const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class IncomingMessage extends Model {
    static associate(models) {
      IncomingMessage.belongsTo(models.CustomerPhone, {
        foreignKey: 'PhoneID',
        as: 'phone'
      });
    }
  }

  IncomingMessage.init({
    MessageID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    PhoneID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'CustomerPhones',
        key: 'PhoneID'
      }
    },
    WhatsAppMessageID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    Content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    MediaURL: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ReceivedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('GETDATE()')
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'unread'
    }
  }, {
    sequelize,
    modelName: 'IncomingMessage',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt'
  });

  return IncomingMessage;
}
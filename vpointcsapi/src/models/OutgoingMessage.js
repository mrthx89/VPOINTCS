const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OutgoingMessage extends Model {
    static associate(models) {
      OutgoingMessage.belongsTo(models.CustomerPhone, {
        foreignKey: 'PhoneID',
        as: 'phone'
      });
      OutgoingMessage.belongsTo(models.User, {
        foreignKey: 'UserID',
        as: 'user'
      });
    }
  }

  OutgoingMessage.init({
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
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'UserID'
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
    SentAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('GETDATE()')
    },
    Status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'sent'
    }
  }, {
    sequelize,
    modelName: 'OutgoingMessage',
    timestamps: true,
    createdAt: 'CreatedAt',
    updatedAt: 'UpdatedAt',
    underscored: false
  });

  return OutgoingMessage;
}
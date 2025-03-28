module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OutgoingMessages', {
      MessageID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      CustomerID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Customers',
          key: 'CustomerID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      UserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'UserID'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      WhatsAppMessageID: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      Content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      MediaURL: {
        type: Sequelize.STRING,
        allowNull: true
      },
      SentAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('GETDATE()')
      },
      Status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'sent'
      },
      CreatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('GETDATE()')
      },
      UpdatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('GETDATE()')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OutgoingMessages');
  }
}
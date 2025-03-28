module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('IncomingMessages', {
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
      ReceivedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('GETDATE()')
      },
      Status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'unread'
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
    await queryInterface.dropTable('IncomingMessages');
  }
}
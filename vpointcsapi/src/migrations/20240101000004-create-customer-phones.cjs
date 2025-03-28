module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CustomerPhones', {
      PhoneID: {
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
      WhatsAppNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      PhoneType: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'personal'
      },
      IsActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    await queryInterface.dropTable('CustomerPhones');
  }
}
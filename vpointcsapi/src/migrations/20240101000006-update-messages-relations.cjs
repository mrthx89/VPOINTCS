module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove existing CustomerID foreign key from IncomingMessages
    await queryInterface.removeConstraint('IncomingMessages', 'IncomingMessages_CustomerID_fkey');
    await queryInterface.removeColumn('IncomingMessages', 'CustomerID');

    // Add PhoneID column to IncomingMessages
    await queryInterface.addColumn('IncomingMessages', 'PhoneID', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'CustomerPhones',
        key: 'PhoneID'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Remove existing CustomerID foreign key from OutgoingMessages
    await queryInterface.removeConstraint('OutgoingMessages', 'OutgoingMessages_CustomerID_fkey');
    await queryInterface.removeColumn('OutgoingMessages', 'CustomerID');

    // Add PhoneID column to OutgoingMessages
    await queryInterface.addColumn('OutgoingMessages', 'PhoneID', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'CustomerPhones',
        key: 'PhoneID'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert OutgoingMessages changes
    await queryInterface.removeColumn('OutgoingMessages', 'PhoneID');
    await queryInterface.addColumn('OutgoingMessages', 'CustomerID', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'CustomerID'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Revert IncomingMessages changes
    await queryInterface.removeColumn('IncomingMessages', 'PhoneID');
    await queryInterface.addColumn('IncomingMessages', 'CustomerID', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'CustomerID'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
}
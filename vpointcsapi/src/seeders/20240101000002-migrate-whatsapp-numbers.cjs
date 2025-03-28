module.exports = {
  async up(queryInterface, Sequelize) {
    // Get all existing customers
    const customers = await queryInterface.sequelize.query(
      'SELECT CustomerID, WhatsAppNumber FROM Customers WHERE WhatsAppNumber IS NOT NULL',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Insert customer phone numbers into CustomerPhones table
    if (customers.length > 0) {
      const customerPhones = customers.map(customer => ({
        CustomerID: customer.CustomerID,
        WhatsAppNumber: customer.WhatsAppNumber,
        PhoneType: 'personal',
        IsActive: true,
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      }));

      await queryInterface.bulkInsert('CustomerPhones', customerPhones);
    }
  },

  async down(queryInterface, Sequelize) {
    // Delete all migrated phone numbers
    await queryInterface.bulkDelete('CustomerPhones', null, {});
  }
}
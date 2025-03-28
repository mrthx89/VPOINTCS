module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Customers', [
      {
        WhatsAppNumber: '6281234567890',
        Name: 'John Doe',
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      },
      {
        WhatsAppNumber: '6289876543210',
        Name: 'Jane Smith',
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      },
      {
        WhatsAppNumber: '6287654321098',
        Name: 'Robert Johnson',
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Customers', null, {});
  }
}
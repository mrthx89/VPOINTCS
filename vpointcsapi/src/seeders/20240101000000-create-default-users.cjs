const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('cs123456', salt);

    await queryInterface.bulkInsert('Users', [
      {
        Username: 'cs1',
        Password: defaultPassword,
        Name: 'Customer Service 1',
        Role: 'cs',
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      },
      {
        Username: 'cs2',
        Password: defaultPassword,
        Name: 'Customer Service 2',
        Role: 'cs',
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      },
      {
        Username: 'admin',
        Password: await bcrypt.hash('admin123456', salt),
        Name: 'Administrator',
        Role: 'admin',
        CreatedAt: new Date(),
        UpdatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
}
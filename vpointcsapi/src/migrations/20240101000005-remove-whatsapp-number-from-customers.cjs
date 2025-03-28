module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Check if WhatsAppNumber column exists in Customers table
      const tableInfo = await queryInterface.describeTable('Customers');
      if (!tableInfo.WhatsAppNumber) {
        console.log('WhatsAppNumber column does not exist in Customers table. Skipping migration.');
        return;
      }

      // Check if CustomerPhones table exists
      const tables = await queryInterface.showAllTables();
      if (!tables.includes('CustomerPhones')) {
        throw new Error('CustomerPhones table does not exist. Please run previous migrations first.');
      }

      // Get all customers with their WhatsApp numbers
      const customers = await queryInterface.sequelize.query(
        'SELECT CustomerID, WhatsAppNumber FROM Customers WHERE WhatsAppNumber IS NOT NULL AND TRIM(WhatsAppNumber) != \'\'',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      // Begin transaction
      const transaction = await queryInterface.sequelize.transaction();

      try {
        // Insert WhatsApp numbers into CustomerPhones table
        for (const customer of customers) {
          // Check if phone number already exists
          const existingPhone = await queryInterface.sequelize.query(
            'SELECT PhoneID FROM CustomerPhones WHERE WhatsAppNumber = ?',
            {
              replacements: [customer.WhatsAppNumber],
              type: queryInterface.sequelize.QueryTypes.SELECT,
              transaction
            }
          );

          if (existingPhone.length === 0) {
            await queryInterface.sequelize.query(
              'INSERT INTO CustomerPhones (CustomerID, WhatsAppNumber, PhoneType, IsActive, CreatedAt, UpdatedAt) VALUES (?, ?, ?, ?, GETDATE(), GETDATE())',
              {
                replacements: [customer.CustomerID, customer.WhatsAppNumber, 'personal', true],
                type: queryInterface.sequelize.QueryTypes.INSERT,
                transaction
              }
            );
          }
        }

        // Remove WhatsAppNumber column from Customers table
        await queryInterface.removeColumn('Customers', 'WhatsAppNumber', { transaction });

        // Commit transaction
        await transaction.commit();
      } catch (error) {
        // Rollback transaction if error occurs
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Add WhatsAppNumber column back to Customers table
      await queryInterface.addColumn('Customers', 'WhatsAppNumber', {
        type: Sequelize.STRING,
        allowNull: false
      }, { transaction });

      // Get all customer phones
      const customerPhones = await queryInterface.sequelize.query(
        'SELECT CustomerID, WhatsAppNumber FROM CustomerPhones WHERE PhoneType = \'personal\'',
        { type: queryInterface.sequelize.QueryTypes.SELECT, transaction }
      );

      // Move WhatsApp numbers back to Customers table
      for (const phone of customerPhones) {
        await queryInterface.sequelize.query(
          'UPDATE Customers SET WhatsAppNumber = ? WHERE CustomerID = ?',
          {
            replacements: [phone.WhatsAppNumber, phone.CustomerID],
            type: queryInterface.sequelize.QueryTypes.UPDATE,
            transaction
          }
        );
      }

      // Delete the migrated phone records
      await queryInterface.sequelize.query(
        'DELETE FROM CustomerPhones WHERE PhoneType = \'personal\'',
        { type: queryInterface.sequelize.QueryTypes.DELETE, transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
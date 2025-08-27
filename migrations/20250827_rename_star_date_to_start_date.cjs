'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add new column
    await queryInterface.addColumn('Plans', 'start_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    // Copy data from old column to new column (if exists)
    await queryInterface.sequelize.query(
      'UPDATE Plans SET start_date = star_date'
    );
    // Remove old column
    await queryInterface.removeColumn('Plans', 'star_date');
  },
  down: async (queryInterface, Sequelize) => {
    // Add old column back
    await queryInterface.addColumn('Plans', 'star_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    // Copy data back
    await queryInterface.sequelize.query(
      'UPDATE Plans SET star_date = start_date'
    );
    // Remove new column
    await queryInterface.removeColumn('Plans', 'start_date');
  }
};
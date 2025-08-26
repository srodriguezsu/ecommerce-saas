'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tenants', 'national_id_type', {
      type: Sequelize.ENUM('CC', 'NIT'),
      allowNull: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tenants', 'national_id_type');
  }
};
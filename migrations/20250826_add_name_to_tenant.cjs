'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Tenants', 'name', {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: ''
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Tenants', 'name');
  }
};

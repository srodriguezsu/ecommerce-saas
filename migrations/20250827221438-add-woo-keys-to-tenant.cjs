'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Tenants', 'woo_public_key', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
    await queryInterface.addColumn('Tenants', 'woo_private_key', {
      type: Sequelize.STRING(255),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tenants', 'woo_public_key');
    await queryInterface.removeColumn('Tenants', 'woo_private_key');
  }
};

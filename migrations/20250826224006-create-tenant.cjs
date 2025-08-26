'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tenants', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      national_id: { type: Sequelize.STRING(255) },
      first_name: { type: Sequelize.STRING(255) },
      url: { type: Sequelize.STRING(255) },
      wp_public_key: { type: Sequelize.STRING(255) },
      wp_private_key: { type: Sequelize.STRING(255) },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Tenants');
  }
};
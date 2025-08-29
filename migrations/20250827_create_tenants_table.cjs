'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tenants', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      national_id: { type: Sequelize.STRING(255) },
      national_id_type: { type: Sequelize.ENUM('CC', 'NIT') },
      name: { type: Sequelize.STRING(255) },
      url: { type: Sequelize.STRING(255) },
      wp_public_key: { type: Sequelize.STRING(255) },
      wp_private_key: { type: Sequelize.STRING(255) },
      woo_public_key: { type: Sequelize.STRING(255) },
      woo_private_key: { type: Sequelize.STRING(255) },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Tenants');
  }
};
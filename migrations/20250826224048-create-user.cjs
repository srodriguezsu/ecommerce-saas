'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      tenant_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Tenants', key: 'id' }
      },
      email: { type: Sequelize.STRING(255), unique: true },
      name: { type: Sequelize.STRING(255) },
      last_name: { type: Sequelize.STRING(255) },
      password_hashed: { type: Sequelize.STRING(255) },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Users');
  }
};
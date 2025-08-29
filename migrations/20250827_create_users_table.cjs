'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      tenant_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Tenants', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false
      },
      email: { type: Sequelize.STRING(255), unique: true, allowNull: false },
      name: { type: Sequelize.STRING(255) },
      last_name: { type: Sequelize.STRING(255) },
      password_hashed: { type: Sequelize.STRING(255), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Users');
  }
};
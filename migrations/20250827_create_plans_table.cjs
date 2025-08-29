'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Plans', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      tenant_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Tenants', key: 'id' },
        onDelete: 'CASCADE',
        allowNull: false
      },
      start_date: { type: Sequelize.DATE },
      end_date: { type: Sequelize.DATE },
      price: { type: Sequelize.FLOAT },
      description: { type: Sequelize.TEXT },
      type: { type: Sequelize.ENUM('BRONCE', 'PLATA', 'ORO') },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Plans');
  }
};
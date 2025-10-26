'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Countries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true // Countries must have a unique name
      },
      capital: {
        type: Sequelize.STRING,
        allowNull: true // Optional
      },
      region: {
        type: Sequelize.STRING,
        allowNull: true // Optional
      },
      population: {
        type: Sequelize.INTEGER,
        allowNull: false // Required
      },
      currency_code: {
        type: Sequelize.STRING,
        allowNull: true // Can be null per requirements
      },
      exchange_rate: {
        type: Sequelize.FLOAT,
        allowNull: true // Can be null per requirements
      },
      estimated_gdp: {
        type: Sequelize.DOUBLE,
        allowNull: true // Can be null per requirements
      },
      flag_url: {
        type: Sequelize.STRING,
        allowNull: true // Optional
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE // This will serve as our last_refreshed_at
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Countries');
  }
};
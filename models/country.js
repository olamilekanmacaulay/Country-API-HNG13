'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    static associate(models) {
      // associations
    }
  }
  Country.init({
    name: DataTypes.STRING,
    capital: DataTypes.STRING,
    region: DataTypes.STRING,
    population: DataTypes.INTEGER,
    currency_code: DataTypes.STRING,
    exchange_rate: DataTypes.FLOAT,
    estimated_gdp: DataTypes.DOUBLE,
    flag_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Country',
  });
  return Country;
};
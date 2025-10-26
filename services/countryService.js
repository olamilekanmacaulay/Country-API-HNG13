const { Country } = require('../models');
const redisClient = require('../config/redis');
const { fetchExternalData, getRandomMultiplier } = require('./externalApiService');
const { generateSummaryImage } = require('./imageService');

const refreshCountryData = async () => {
    const { countries, rates } = await fetchExternalData();

    const processedCountries = countries.map(country => {
        const currency = country.currencies?.[0];
        const currency_code = currency ? currency.code : null;
        const exchange_rate = currency_code && rates[currency_code] ? rates[currency_code] : null;
        let estimated_gdp = 0;
        if (exchange_rate && country.population) {
        estimated_gdp = (country.population * getRandomMultiplier()) / exchange_rate;
        }

        return {
        name: country.name,
        capital: country.capital,
        region: country.region,
        population: country.population,
        flag_url: country.flag,
        currency_code: currency_code,
        exchange_rate: exchange_rate,
        estimated_gdp: estimated_gdp,
        };
    });

    // Save to PostgreSQL Database (Insert or Update)
    await Country.bulkCreate(processedCountries, {
        updateOnDuplicate: ['capital', 'region', 'population', 'flag_url', 'currency_code', 'exchange_rate', 'estimated_gdp', 'updatedAt'],
        conflictAttributes: ['name']
    });

    // Invalidate (clear) the Redis cache
    const keys = await redisClient.keys('countries:*');
    if (keys.length > 0) {
        await redisClient.del(keys);
    }
    await redisClient.del('status'); // Also clear the status cache

    await generateSummaryImage();

    return { message: `Successfully refreshed ${processedCountries.length} countries.` };
};

module.exports = {
    refreshCountryData
};
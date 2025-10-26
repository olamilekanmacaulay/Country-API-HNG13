const path = require('path');
const fs = require('fs');
const countryService = require('../services/countryService');
const redisClient = require('../config/redis');
const { Country } = require('../models');
const { Op } = require('sequelize');

const refreshCountries = async (requestAnimationFrame, res) => {
    try {
        const result = await countryService.refreshCountryData();
        res.status(200).json(result);
    } catch (error) {
        if (error.message === 'External data source unavailable') {
            return res.status(503).json({
                error: "External data source unavailable",
                details: "Could not fetch data from one or more external APIs."
            });
        }

        console.error('Refresh failed:', error);
        res.status(500).json({ error: 'Internal server error' });
  }
};

const getSummaryImage = (req, res) => {
    const imagePath = path.join(__dirname, '..', 'cache', 'summary.png');

    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).json({ error: "Summary image not found" });
    }
};

const getCountries = async (req, res) => {
    const { region, currency, sort } = req.query;

    const cacheKey = `countries:region=${region || 'all'}:currency=${currency || 'all'}:sort=${sort || 'default'}`;

    try {
        // Query cache first
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        // If not in cache, query the database
        const queryOptions = { where: {}, order: [['name', 'ASC']] }; 

        if (region) {
            queryOptions.where.region = { [Op.iLike]: `%${region}%` };
        }
        if (currency) {
            queryOptions.where.currency_code = { [Op.iLike]: currency };
        }
        if (sort) {
            const [field, direction] = sort.split('_');
            const normalizedDirection = direction?.toUpperCase();

            const allowedSortFields = ['name', 'population', 'region', 'estimated_gdp'];
            if (allowedSortFields.includes(field) && ['ASC', 'DESC'].includes(normalizedDirection)) {

                if (field === 'estimated_gdp' && normalizedDirection === 'DESC') {
                    queryOptions.order = [['estimated_gdp', 'DESC NULLS LAST']];
                } else {
                    queryOptions.order = [[field, normalizedDirection]];
                }
            }
        }
        const countries = await Country.findAll(queryOptions);

        await redisClient.set(cacheKey, JSON.stringify(countries), 'EX', 3600);

        res.status(200).json(countries);
    } catch (error) {
        console.error('Error in get countries endpoint:', error);

        res.status(500).json({ error: 'Internal server error' });
    }
};

const getCountryByName = async (req, res) => {
    const { name } = req.params;
    const cacheKey = `country:${name.toLowerCase()}`;

    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        const country = await Country.findOne({
            where: { name: { [Op.iLike]: name } }
        });

        if (!country) {
            return res.status(404).json({ error: 'Country not found' });
        }

        await redisClient.set(cacheKey, JSON.stringify(country), 'EX', 3600);
        res.status(200).json(country);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteCountry = async (req, res) => {
    const { name } = req.params;

    try {
        const result = await Country.destroy({
            where: { name: { [Op.iLike]: name } }
        });

        if (result === 0) {
            return res.status(404).json({ error: 'Country not found' });
        }

        // Invalidate all related caches since the data has changed
        const keys = await redisClient.keys('countries:*');
        if (keys.length > 0) await redisClient.del(keys);
        await redisClient.del('status');
        await redisClient.del(`country:${name.toLowerCase()}`);

        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getStatus = async (req, res) => {
    const cacheKey = 'status';

    try {
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        const total_countries = await Country.count();
        const lastRefreshedRecord = await Country.findOne({
            order: [['updatedAt', 'DESC']]
        });

        const status = {
            total_countries,
            last_refreshed_at: lastRefreshedRecord ? lastRefreshedRecord.updatedAt : null
        };

        await redisClient.set(cacheKey, JSON.stringify(status), 'EX', 3600);
        res.status(200).json(status);
    } catch (error) {
        console.error('Error in getStatus endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    refreshCountries,
    getSummaryImage,
    getCountries,
    getCountryByName,
    deleteCountry,
    getStatus
};

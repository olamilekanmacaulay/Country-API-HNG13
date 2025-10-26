const express = require('express');
const router = express.Router();
const countryController = require('../controllers/countryController');


// Main refresh endpoint
router.post('/refresh', countryController.refreshCountries);

// Get all countries with optional filtering/sorting
router.get('/', countryController.getCountries);

// Get summary image
router.get('/image', countryController.getSummaryImage);

// Get a single country by name
router.get('/:name', countryController.getCountryByName);

// Delete a country by name
router.delete('/:name', countryController.deleteCountry);


module.exports = router;
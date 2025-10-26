const sharp = require('sharp');
const fs = require('fs/promises');
const path = require('path');
const { Country } = require('../models');
const { Op } = require('sequelize');

const generateSummaryImage = async () => {
    try {
		// Fetch data from the database
		const totalCountries = await Country.count();
		const topCountries = await Country.findAll({
			where: {
				estimated_gdp: {
					[Op.gt]: 0
				}
			},
			order: [['estimated_gdp', 'DESC NULLS LAST']],
			limit: 5,
		});

		// Text content for the image
		const lastRefreshed = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
		
		let topCountriesText = topCountries.map((country, index) => {
			const gdp = country.estimated_gdp ? (country.estimated_gdp / 1e9).toFixed(2) + 'B' : 'N/A';
			return `${index + 1}. ${country.name} - $${gdp}`;
		}).join('\n');

		const topCountriesSpans = topCountriesText.split('\n')
			.map(line => `<tspan x="60" dy="1.2em">${line}</tspan>`)
			.join('');

		// Create an SVG with the text
		const svgText = `
			<svg width="800" height="400">
				<style>
					.title { fill: #000; font-size: 32px; font-family: Arial, sans-serif; font-weight: bold; }
					.subtitle { fill: #333; font-size: 20px; font-family: Arial, sans-serif; }
					.data { fill: #111; font-size: 18px; font-family: 'Courier New', monospace; }
				</style>
				<text x="50" y="60" class="title">Country Data Summary</text>
				<text x="50" y="90" class="subtitle">Total Countries Cached: ${totalCountries}</text>
				<text x="50" y="120" class="subtitle">Top 5 Countries by Estimated GDP:</text>
				<text x="60" y="150" class="data">${topCountriesSpans}</text>
				<text x="50" y="350" class="subtitle">Last Refreshed: ${lastRefreshed} (WAT)</text>
			</svg>
		`;

		// Generate and save the image
		const imagePath = path.join(__dirname, '..', 'cache');
		await fs.mkdir(imagePath, { recursive: true });
		
		await sharp(Buffer.from(svgText))
			.resize(800, 400)
			.flatten({ background: { r: 240, g: 240, b: 240, alpha: 1 } })
			.png()
			.toFile(path.join(imagePath, 'summary.png'));

		console.log('Summary image generated successfully.');

	} catch (error) {
		console.error('Failed to generate summary image:', error);
	}
};

module.exports = {
    generateSummaryImage
};
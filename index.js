require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();


const db = require('./models');
const redisClient = require("./config/redis");
const countryRoutes = require('./routes/country.routes');
const countryController = require('./controllers/countryController');


const port = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/countries', countryRoutes);
app.get('/status', countryController.getStatus);


const startServer = async () => {
    // 1. Connect to the database
    try {
      await db.sequelize.authenticate();
      console.log('✅ Database connected successfully.');
    } catch (dbError) {
      console.error('❌ Failed to connect to the database:', dbError);
      process.exit(1);
    }

    redisClient;
    
    console.log('All connections established. Starting services...');
    
    
    // 4. Start the Express server
    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
    });
};

// --- Execute the startup ---
startServer();

module.exports = app;
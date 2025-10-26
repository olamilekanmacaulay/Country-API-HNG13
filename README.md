# HNG Stage 2: Country & Exchange Rate API
This is a RESTful API built for the HNG Stage 2 Backend Task. It fetches country and currency exchange rate data from external sources, processes it, and caches it in a PostgreSQL database with a Redis layer for faster responses. It also generates a summary image of the cached data.
---
## Live API URL
The API is hosted and available at the following base URL:
country-api-hng13-production.up.railway.app
---
## Features
- **Data Aggregation**: Fetches and combines data from two separate external APIs.
- **Database Caching**: Caches the processed data in a PostgreSQL database to ensure data persistence and reduce reliance on external services.
- **High-Speed Caching**: Uses Redis to cache API responses for near-instantaneous data retrieval on repeated requests.
- **Dynamic Image Generation**: Creates a summary image of the key data points after each refresh.
- **Flexible Filtering & Sorting**: Supports dynamic filtering by region or currency and sorting by various fields.
---
## Technology Stack
- **Backend**: Node.js
- **Framework**: Express.js
- **Primary Database**: PostgreSQL
- **ORM**: Sequelize
- **Caching**: Redis (ioredis)
- **Image Generation**: Sharp
- **API Requests**: Axios
---
## Local Setup and Installation
To run this project on your local machine, follow these steps:
### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
### 1. Clone the Repository
bash
git clone [https://github.com/olamilekanmacaulay/Country-API-HNG13.git](https://github.com/olamilekanmacaulay/Country-API-HNG13.git)
cd Country-API-HNG13
2. Install Dependencies
This project uses npm to manage all the required packages. Run the following command to install them:

Bash

npm install
This will install Express, Sequelize, pg, ioredis, axios, sharp, and other necessary development tools.

3. Set Up Environment Variables
Create a .env file in the root of the project. It requires the following variables:

# Your PostgreSQL connection string
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
DATABASE_URL="your_postgresql_connection_string"

# Your Redis connection string
REDIS_URL="redis://127.0.0.1:6379"

# The port the server will run on (optional, defaults to 8080)
PORT=8080
4. Run Database Migrations
Before starting the server, you need to create the Countries table in your PostgreSQL database. Run the following command:

Bash

npx sequelize-cli db:migrate
5. Start the Server
Run the development server using this command:

Bash

npm run start:dev

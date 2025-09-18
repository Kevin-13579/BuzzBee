/**
 * server.js
 * Entry point for SmartBus backend.
 *
 * Usage:
 * 1. npm install
 * 2. copy .env.example to .env and fill values
 * 3. npm run seed   <-- creates tables + sample data
 * 4. npm run dev    <-- starts server with nodemon
 */

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const sequelize = require('./config/db');
const { User, Bus, Schedule } = require('./models'); // ensures models & associations are registered

const authRoutes = require('./routes/auth');
const busesRoutes = require('./routes/buses');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes.router);
app.use('/api/buses', busesRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'SmartBus backend up', timestamp: new Date() });
});

// Start server after testing DB connection
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✔️  Database connection has been established successfully.');

    // Only auto-sync if you set SYNC_DB=true (for dev). Otherwise use seed script to create tables.
    if (process.env.SYNC_DB === 'true') {
      await sequelize.sync({ alter: true });
      console.log('✔️  DB synced (alter).');
    }

    app.listen(PORT, () => {
      console.log(`🚀  Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

start();

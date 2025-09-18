/**
 * routes/buses.js
 * Bus-related routes:
 * - GET  /api/buses                -> list buses (optional query from,to,date)
 * - GET  /api/buses/:id            -> bus details + schedules
 * - POST /api/buses                -> create new bus (authority only)
 * - POST /api/buses/:id/schedules  -> add schedule to bus (authority only)
 *
 * Uses authenticate middleware exported from auth.js
 */

const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

const { Bus, Schedule } = require('../models');
const auth = require('./auth'); // exports { router, authenticate }

// Helper to check authority role
function ensureAuthority(req, res, next) {
  if (!req.user || req.user.role !== 'authority') {
    return res.status(403).json({ error: 'Forbidden: authority role required' });
  }
  next();
}

/**
 * GET /api/buses
 * Query params (optional): from, to, date (YYYY-MM-DD)
 * If from & to provided, filter buses by route. If date provided, include schedules for that date.
 */
router.get('/', async (req, res) => {
  try {
    const { from, to, date } = req.query;

    const where = {};
    if (from) where.from = from;
    if (to) where.to = to;

    const includeSchedules = {
      model: Schedule,
      as: 'schedules'
    };

    if (date) {
      includeSchedules.where = { date }; // only schedules for that date
      includeSchedules.required = false; // still return bus even if no schedule matching date
    }

    const buses = await Bus.findAll({
      where,
      include: [includeSchedules]
    });

    res.json({ buses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching buses' });
  }
});

/**
 * GET /api/buses/:id
 * Returns bus details + all schedules for that bus
 */
router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findByPk(req.params.id, {
      include: [{ model: Schedule, as: 'schedules' }]
    });
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    res.json({ bus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching bus' });
  }
});

/**
 * POST /api/buses
 * Body: { name, busNumber, from, to, imageUrl, description, isActive }
 * Protected: authority only
 */
router.post('/', auth.authenticate, ensureAuthority, async (req, res) => {
  try {
    const { name, busNumber, from, to, imageUrl, description, isActive } = req.body;
    if (!name || !busNumber || !from || !to) return res.status(400).json({ error: 'name, busNumber, from and to are required' });

    const bus = await Bus.create({
      name,
      busNumber,
      from,
      to,
      imageUrl: imageUrl || null,
      description: description || null,
      isActive: (typeof isActive === 'boolean') ? isActive : true
    });

    res.json({ bus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating bus' });
  }
});

/**
 * POST /api/buses/:id/schedules
 * Body: { date (YYYY-MM-DD or null), departureTime (HH:MM:SS), arrivalTime, sourceStop, destStop, extraInfo }
 * Protected: authority only
 */
router.post('/:id/schedules', auth.authenticate, ensureAuthority, async (req, res) => {
  try {
    const busId = req.params.id;
    const bus = await Bus.findByPk(busId);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });

    const { date, departureTime, arrivalTime, sourceStop, destStop, extraInfo } = req.body;
    if (!departureTime || !arrivalTime) return res.status(400).json({ error: 'departureTime and arrivalTime are required' });

    const schedule = await Schedule.create({
      busId: bus.id,
      date: date || null,
      departureTime,
      arrivalTime,
      sourceStop: sourceStop || null,
      destStop: destStop || null,
      extraInfo: extraInfo || null
    });

    res.json({ schedule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating schedule' });
  }
});

module.exports = router;

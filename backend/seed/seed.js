/**
 * backend/seed/seed.js
 *
 * Run this script to recreate tables and insert initial sample data.
 *
 * Usage:
 *   npm run seed
 *
 * ⚠️ WARNING: This uses sequelize.sync({ force: true })
 * which DROPS ALL TABLES and recreates them from scratch.
 */

require("dotenv").config();
const bcrypt = require("bcryptjs");

// Import sequelize and models
const { sequelize, User, Bus, Schedule } = require("../models");

async function seed() {
  try {
    console.log("⚙️  Syncing database (force:true)...");
    await sequelize.sync({ force: true }); // Drops & recreates tables
    console.log("✔️  Database synced.");

    // ====== USERS ======
    // Authority (Admin) user
    const passwordHashAuth = await bcrypt.hash("admin123", 10);
    const authority = await User.create({
      name: "Admin Authority",
      email: "admin@smartbus.com",
      passwordHash: passwordHashAuth,
      role: "authority",
      isVerified: true,
    });

    // Passenger user
    const passwordHashUser = await bcrypt.hash("pass1234", 10);
    const passenger = await User.create({
      name: "Test Passenger",
      email: "user@smartbus.com",
      passwordHash: passwordHashUser,
      role: "passenger",
      isVerified: true,
    });

    console.log("✔️  Users inserted.");

    // ====== BUSES ======
    const bus1 = await Bus.create({
      name: "Blue Express",
      busNumber: "BLU-101",
      from: "Central Station",
      to: "North Park",
      imageUrl: "",
      description: "Fast service between Central Station and North Park.",
      isActive: true,
    });

    const bus2 = await Bus.create({
      name: "Black Line",
      busNumber: "BLK-202",
      from: "Central Station",
      to: "East Mall",
      imageUrl: "",
      description: "Frequent stops, economical ride.",
      isActive: true,
    });

    console.log("✔️  Buses inserted.");

    // ====== SCHEDULES ======
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    const tomorrowStr = `${yyyy}-${mm}-${dd}`;

    await Schedule.bulkCreate([
      {
        busId: bus1.id,
        date: tomorrowStr,
        departureTime: "09:00:00",
        arrivalTime: "09:45:00",
        sourceStop: "Central Station",
        destStop: "North Park",
        extraInfo: "Two stops only",
      },
      {
        busId: bus1.id,
        date: null, // null = recurring schedule
        departureTime: "17:00:00",
        arrivalTime: "17:45:00",
        sourceStop: "Central Station",
        destStop: "North Park",
        extraInfo: "Evening run",
      },
      {
        busId: bus2.id,
        date: tomorrowStr,
        departureTime: "08:30:00",
        arrivalTime: "09:30:00",
        sourceStop: "Central Station",
        destStop: "East Mall",
        extraInfo: "Via Market Street",
      },
    ]);

    console.log("✔️  Schedules inserted.");

    // ====== DONE ======
    console.log("🎉 Seed data inserted successfully!");
    console.log("🔑 Authority login: admin@smartbus.com / admin123");
    console.log("🔑 Passenger login: user@smartbus.com / pass1234");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seed();

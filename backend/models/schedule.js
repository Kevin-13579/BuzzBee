/**
 * models/schedule.js
 * Schedule entries (can be date-specific).
 *
 * date: if provided, this schedule applies to that date.
 * if date is null, you may treat it as a recurring schedule (front-end logic).
 */

module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define(
    'Schedule',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      busId: { type: DataTypes.INTEGER, allowNull: false },
      date: { type: DataTypes.DATEONLY, allowNull: true },
      departureTime: { type: DataTypes.TIME, allowNull: false },
      arrivalTime: { type: DataTypes.TIME, allowNull: false },
      sourceStop: { type: DataTypes.STRING, allowNull: true },
      destStop: { type: DataTypes.STRING, allowNull: true },
      extraInfo: { type: DataTypes.TEXT, allowNull: true }
    },
    {
      tableName: 'schedules',
      timestamps: true
    }
  );

  return Schedule;
};


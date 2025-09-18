/**
 * models/bus.js
 * Bus model representing a route and its metadata.
 */

module.exports = (sequelize, DataTypes) => {
  const Bus = sequelize.define(
    'Bus',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      busNumber: { type: DataTypes.STRING, allowNull: false },
      from: { type: DataTypes.STRING, allowNull: false },
      to: { type: DataTypes.STRING, allowNull: false },
      imageUrl: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.TEXT, allowNull: true },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
    },
    {
      tableName: 'buses',
      timestamps: true
    }
  );

  return Bus;
};

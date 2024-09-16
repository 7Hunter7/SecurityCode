// src/models/SIZItem.js
import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const SIZItem = sequelize.define("SIZItem", {
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  voltageClass: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  szType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  testDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  nextTestDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  lastInspectDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default SIZItem;

import { DataTypes } from "sequelize";
import sequelize from "../data/db.js";

const SIZItem = sequelize.define("SIZItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 100],
    },
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 100],
    },
  },
  voltageClass: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["0,4", "1", "3", "6", "10", "15", "20", "35", "110", "220"]],
    },
  },
  szType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 100],
    },
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    validate: {
      isInt: true,
    },
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
    validate: {
      min: 1,
    },
  },
  classQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
    validate: {
      len: [0, 255],
    },
  },
});

export default SIZItem;

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
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  voltage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  szType: {
    type: DataTypes.STRING,
    allowNull: true, // Поле не обязательное
    defaultValue: "—", // Cтрока по умолчанию
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  testDate: {
    type: DataTypes.DATEONLY, // Изменено на DATEONLY
    allowNull: true,
    defaultValue: null,
  },
  nextTestDate: {
    type: DataTypes.DATEONLY, // Изменено на DATEONLY
    allowNull: true,
    defaultValue: null,
  },
  lastInspectDate: {
    type: DataTypes.DATEONLY, // Изменено на DATEONLY
    allowNull: true,
    defaultValue: null,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // Значение по умолчанию
  },
  inspectionResult: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default SIZItem;

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
  voltageClass: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  szType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "-", // Cтрока по умолчанию
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
    allowNull: true, // Можно не заполнять
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // Устанавливаем значение по умолчанию
  },
  classQuantity: {
    type: DataTypes.INTEGER,
    allowNull: true, // Поле не обязательное
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true, // Поле не обязательное
    defaultValue: "", // Пустая строка по умолчанию
  },
});

export default SIZItem;

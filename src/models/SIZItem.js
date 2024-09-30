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
    allowNull: true, // Поле не обязательное
    defaultValue: "—", // Cтрока по умолчанию
  },
  number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  testDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: "—",
  },
  nextTestDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: "—",
  },
  lastInspectDate: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: "—",
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // Устанавливаем значение по умолчанию
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true, // Поле не обязательное
    defaultValue: "—", // Пустая строка по умолчанию
  },
});

export default SIZItem;

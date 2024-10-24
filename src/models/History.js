import { DataTypes } from "sequelize";
import sequelize from "../data/db.js";

const History = sequelize.define("History", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sizType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sizNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Поле для ID пользователя
  },
  userFullName: {
    type: DataTypes.STRING,
    allowNull: true, // Поле для полного имени пользователя (ФИО)
  },
  userDepartmentInfo: {
    type: DataTypes.STRING,
    allowNull: true, // Поле для информации о подразделении (Филиал, Подразделение, РЭС/Бригада)
  },
  details: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

export default History;

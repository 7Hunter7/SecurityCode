import { DataTypes } from "sequelize";
import sequelize from "../data/db.js";

const History = sequelize.define("History", {
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sizNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  sizType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  details: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

export default History;

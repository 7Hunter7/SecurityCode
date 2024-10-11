import { DataTypes } from "sequelize";
import sequelize from "../data/db.js";

const History = sequelize.define("History", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
  details: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

export default History;

import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import User from "./User.js";

const OTP = sequelize.define("OTP", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: { model: User, key: "id" },
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING(6),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "OTPs",
  timestamps: false,
});

export default OTP;
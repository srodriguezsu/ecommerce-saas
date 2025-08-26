import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import Tenant from "./Tenant.js";

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tenant_id: { type: DataTypes.INTEGER, references: { model: Tenant, key: "id" } },
  email: { type: DataTypes.STRING(255), unique: true },
  name: { type: DataTypes.STRING(255) },
  last_name: { type: DataTypes.STRING(255) },
  password_hashed: { type: DataTypes.STRING(255) },
});

export default User;

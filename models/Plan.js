import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import Tenant from "./Tenant.js";

const Plan = sequelize.define("Plan", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tenant_id: { type: DataTypes.INTEGER, references: { model: Tenant, key: "id" } },
  start_date: { type: DataTypes.DATE },
  end_date: { type: DataTypes.DATE },
  price: { type: DataTypes.FLOAT },
  description: { type: DataTypes.TEXT },
  type: { type: DataTypes.ENUM("BRONCE", "PLATA", "ORO") },
});

export default Plan;

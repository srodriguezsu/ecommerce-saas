import Tenant from "./Tenant.js";
import Plan from "./Plan.js";
import User from "./User.js";

Tenant.hasMany(Plan, { foreignKey: "tenant_id" });
Plan.belongsTo(Tenant, { foreignKey: "tenant_id" });

Tenant.hasMany(User, { foreignKey: "tenant_id" });
User.belongsTo(Tenant, { foreignKey: "tenant_id" });

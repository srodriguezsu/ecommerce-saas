import { DataTypes } from "sequelize";
import sequelize from "./index.js";

const Tenant = sequelize.define("Tenant", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  national_id: { type: DataTypes.STRING(255) },
  national_id_type: { type: DataTypes.ENUM('CC', 'NIT') },
  name: { type: DataTypes.STRING(255) },
  url: { type: DataTypes.STRING(255) },
  wp_public_key: { type: DataTypes.STRING(255) }, // Should be encrypted
  wp_private_key: { type: DataTypes.STRING(255) }, // Should be encrypted
  woo_public_key: { type: DataTypes.STRING(255) }, // Should be encrypted
  woo_private_key: { type: DataTypes.STRING(255) }, // Should be encrypted
});

export default Tenant;

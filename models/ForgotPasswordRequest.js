const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db_connections");
const User = require("./User");

const ForgotPasswordRequest = sequelize.define("ForgotPasswordRequest", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
   UserId: {                   // REQUIRED
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// Relations
User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

module.exports = ForgotPasswordRequest;

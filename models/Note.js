const { DataTypes } = require("sequelize");
const sequelize = require("../utils/db_connections");

const Note = sequelize.define("Note", {
  note: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  UserId: {                     
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Note;

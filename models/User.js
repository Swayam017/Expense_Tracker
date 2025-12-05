const {DataTypes} = require("sequelize");
const sequelize = require("../utils/db_connections");

const User = sequelize.define("User",{
    username:{type:DataTypes.STRING,allowNull:false},
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
     isPremium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

});
module.exports=User;
const Sequelize = require("sequelize");
const { dbConfig } = require("./dbConfig");
require("dotenv").config();

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    { 
        dialect: "mssql", 
        host: dbConfig.host,
        logging: false
    },
    
);

const Staff = require("./Staff")(sequelize);

module.exports = {
    sequelize: sequelize,
    Staff: Staff,
};

require("dotenv").config();
const sql = require("mssql");

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
    port: 1433,
};

const dbConfig = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_SERVER,
    dialect: "mssql",
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
    logging: false,
};

module.exports = {
    dbConfig,
    sql,
    poolPromise: new sql.ConnectionPool(config).connect()
};

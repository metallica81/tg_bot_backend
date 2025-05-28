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

const Staff = require("./tables/Staff")(sequelize);
const Schedule = require("./tables/Schedule")(sequelize);
const ScheduleDay = require("./tables/ScheduleDay")(sequelize);
const ScheduleLesson = require("./tables/ScheduleLesson")(sequelize);
const Queue = require("./tables/Queue")(sequelize);

// Установка ассоциаций
Queue.belongsTo(Staff, {
    foreignKey: "staff_id",
    as: "Staff"
});

module.exports = {
    sequelize: sequelize,
    Staff: Staff,
    Schedule: Schedule,
    ScheduleDay: ScheduleDay,
    ScheduleLesson: ScheduleLesson,
    Queue: Queue
};

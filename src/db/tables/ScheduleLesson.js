const Sequelize = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('ScheduleLesson', {
        lesson_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        day_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        lesson_number: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        start_time: {
            type: Sequelize.STRING,
            allowNull: false
        },
        end_time: {
            type: Sequelize.STRING,
            allowNull: false
        },
        classroom: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    }, {
        tableName: 'ScheduleLesson', 
        schema: 'dbo', 
        timestamps: false, 
        indexes: [
            {
                name: 'PK_ScheduleLesson',
                unique: true,
                fields: ['lesson_id']
            }
        ]
    });
};
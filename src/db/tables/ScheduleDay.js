const Sequelize = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('ScheduleDay', {
        day_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        schedule_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        day_of_week: {
            type: Sequelize.INTEGER, 
            allowNull: false
        },
        lesson_date: {
            type: Sequelize.STRING(50), 
            allowNull: false
        },
    }, {
        tableName: 'ScheduleDay', 
        schema: 'dbo', 
        timestamps: false, 
        indexes: [
            {
                name: 'PK_ScheduleDay',
                unique: true,
                fields: ['day_id']
            }
        ]
    });
};
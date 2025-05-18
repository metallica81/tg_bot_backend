const Sequelize = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('Schedule', {
        staff_id: {
            type: Sequelize.BIGINT,
            allowNull: false
        },
        schedule_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        week_number: {
            type: Sequelize.INTEGER, 
            allowNull: false
        },
    }, {
        tableName: 'Schedule', 
        schema: 'dbo', 
        timestamps: false, 
        indexes: [
            {
                name: 'PK_Schedule',
                unique: true,
                fields: ['schedule_id']
            }
        ]
    });
};
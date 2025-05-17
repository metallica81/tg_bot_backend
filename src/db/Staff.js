const Sequelize = require('sequelize');

module.exports = function (sequelize) {
    return sequelize.define('Staff', {
        staff_id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING(50), 
            allowNull: false
        },
        surname: {
            type: Sequelize.STRING(50), 
            allowNull: false
        },
        average_rating: {
            type: Sequelize.DECIMAL(3, 2), 
            allowNull: true 
        },
        chat_id: {
            type: Sequelize.BIGINT,
            allowNull: true 
        },
        order_amount: {
            type: Sequelize.INTEGER, 
            allowNull: true 
        },
        alias: {
            type: Sequelize.STRING(510), 
            allowNull: true 
        }
    }, {
        tableName: 'Staff', 
        schema: 'dbo', 
        timestamps: false, 
        indexes: [
            {
                name: 'PK_Staff',
                unique: true,
                fields: ['staff_id']
            }
        ]
    });
};
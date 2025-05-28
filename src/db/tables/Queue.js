const Sequelize = require("sequelize");

module.exports = function (sequelize) {
    return sequelize.define(
        "Queue",
        {
            queue_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false,
            },
            staff_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
            },
            position: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "InstructorQueue",
            schema: "dbo",
            timestamps: false,
            indexes: [
                {
                    name: "PK_Schedule",
                    unique: true,
                    fields: ["queue_id"]
                },
            ],
        }
    );
};

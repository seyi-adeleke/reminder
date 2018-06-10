

module.exports = (sequelize, DataTypes) => {
    const Reminder = sequelize.define('Reminder', {
        triggerDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        user: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });

    Reminder.associate = (models) => {
        Reminder.belongsTo(models.Reminder, {
            foreignKey: 'user',
            onDelete: 'CASCADE',
        });
    };
    return Reminder;
};

import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        firstname: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        lastname: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        username: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING,
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
            },
        },
        role: {
            allowNull: false,
            type: DataTypes.INTEGER,
            defaultValue: 2,
        },
    }, {
        hooks: {
            beforeCreate: (user) => {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(user.password, salt);
                user.password = hash;
            },
        },
    });

    User.associate = (models) => {
        User.hasMany(models.Reminder, {
            foreignKey: 'user',
            as: 'Reminders',
        });
    };
    return User;
};

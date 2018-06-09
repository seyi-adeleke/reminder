import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstname: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lastname: {
      allowNull: false,
      type: DataTypes.STRING
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    email:{
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      }
    },
    role: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    hooks: {
      beforeCreate: (user, options)  => {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.password , salt);
        user.password = hash;
      },
    }
  }


);

  return User;
};
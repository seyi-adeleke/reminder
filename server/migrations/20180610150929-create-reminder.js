/*eslint-disable */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Reminders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      triggerDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      message: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      user: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          as: 'user',
        }
      }
    },
  );

  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Reminders');
  }
};
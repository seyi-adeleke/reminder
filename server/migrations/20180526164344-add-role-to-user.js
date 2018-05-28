'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn('users', 'role',
      {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    );
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('users', 'role');
  }
};

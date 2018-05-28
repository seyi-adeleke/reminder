'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn('Users', 'role',
      {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    );
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('Users', 'role');
  }
};

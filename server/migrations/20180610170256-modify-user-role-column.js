/*eslint-disable */
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.changeColumn('Users', 'role',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('Users', 'role');
  }
};

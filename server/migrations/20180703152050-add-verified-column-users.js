/*eslint-disable */
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn('Users', 'verified',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('Users', 'verified');
  }
};

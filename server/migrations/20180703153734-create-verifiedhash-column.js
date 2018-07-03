/*eslint-disable */
module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn('Users', 'verified_hash',
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('Users', 'verified_hash');
  }
};

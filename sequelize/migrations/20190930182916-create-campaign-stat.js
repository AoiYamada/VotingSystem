'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('campaign_stats', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      title: { type: Sequelize.STRING, allowNull: false },
      total_votes: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      start_time: { type: Sequelize.DATE },
      end_time: { type: Sequelize.DATE },
      options: { type: Sequelize.TEXT, allowNull: false, defaultValue: "{}" },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('campaign_stats');
  }
};
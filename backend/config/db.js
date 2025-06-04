const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('task_management', 'root', 'Shrey@nk2304', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;

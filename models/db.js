/**
 * Created by royguo on 4/4/16 AD.
 */

var Sequelize = require("sequelize")
var assert = require('assert')
var config = require('../config')

module.exports = new Sequelize(config.database.db, config.database.user, config.database.passwd, {
    host: config.database.host,
    dialect: 'mysql',
    logging: false,

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

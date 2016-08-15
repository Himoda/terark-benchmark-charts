/**
 * Created by royguo on 4/4/16 AD.
 */

var Sequelize = require("sequelize")
var assert = require('assert')

module.exports = new Sequelize('benchmark', 'terark_benchmark', 'benchmark@123', {
    host: 'rds432w5u5d17qd62iq3o.mysql.rds.aliyuncs.com',
    dialect: 'mysql',
    logging: false,

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});
/**
 * Created by royguo on 4/4/16 AD.
 */

var Sequelize = require("sequelize")

var db = require("./db")

var EngineDBSize = db.define('engine_test_dbsize_10s', {
    time_bucket: Sequelize.INTEGER,
    dbsize: Sequelize.INTEGER,
    engine_name: Sequelize.TEXT
}, {
    timestamps: false,
    tableName: "engine_test_dbsize_10s"
});


EngineDBSize.findAllByTimeBucket = function (name, time_bucket) {
    return EngineDBSize.findAll({
        attributes: ["time_bucket", "dbsize"],
        order: [["time_bucket", "ASC"]],
        where: {
            engine_name: name,
            time_bucket: {
                $in: time_bucket
            }
        },
        raw: true
    }).then(function (data) {
        var dbsize_data = []
        var i = 0
        time_bucket.map(function (item) {
            if (i < data.length && item == data[i].time_bucket) {
                dbsize_data.push(data[i].dbsize / 1024)
                i++
            } else {
                dbsize_data.push('')
            }
        })
        return dbsize_data
    })
}

module.exports = EngineDBSize
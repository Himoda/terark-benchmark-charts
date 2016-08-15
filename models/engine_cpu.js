/**
 * Created by royguo on 4/4/16 AD.
 */

var Sequelize = require("sequelize")

var db = require("./db")

var EngineCpu = db.define('engine_test_cpu_10s', {
    time_bucket: Sequelize.INTEGER,
    usage: Sequelize.INTEGER
}, {
    timestamps: false,
    tableName: "engine_test_cpu_10s"
});


EngineCpu.findAllByTimeBucket = function (name, time_bucket) {
    return EngineCpu.findAll({
        attributes: ["time_bucket", "usage"],
        order: [["time_bucket", "ASC"]],
        where: {
            engine_name: name,
            time_bucket: {
                $in: time_bucket
            }
        },
        raw: true
    }).then(function (data) {
        // TODO fake
        data.usage = []
        for (var i = 0; i < time_bucket.length; i++) {
            data.usage[i] = 10 + Math.random() * 5
        }
        return data
    })
}

module.exports = EngineCpu
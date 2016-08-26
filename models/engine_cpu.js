/**
 * Created by royguo on 4/4/16 AD.
 */

var Sequelize = require("sequelize")

var db = require("./db")

var EngineCpu = db.define('engine_test_cpu_10s', {
    time_bucket: Sequelize.INTEGER,
    usage: Sequelize.DOUBLE
}, {
    timestamps: false,
    tableName: "engine_test_cpu_10s"
});


EngineCpu.findAllByTimeBucket = function (name, time_bucket) {
    return EngineCpu.findAll({
        attributes: ["time_bucket", "usage", "iowait"],
        order: [["time_bucket", "ASC"]],
        where: {
            engine_name: name,
            time_bucket: {
                $in: time_bucket
            }
        },
        raw: true
    }).then(function (data) {
        var cpu_data = {
            usage: [],
            iowait: []
        }
        var i = 0
        time_bucket.map(function (item) {
            if (i < data.length && item == data[i].time_bucket) {
                cpu_data.usage.push(data[i].usage)
                cpu_data.iowait.push(data[i].iowait)
                i++
            } else {
                cpu_data.usage.push('')
                cpu_data.iowait.push('')
            }
        })
        return cpu_data
    })
}

module.exports = EngineCpu
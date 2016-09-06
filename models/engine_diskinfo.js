/**
 * Created by royguo on 4/4/16 AD.
 */

var Sequelize = require("sequelize")

var db = require("./db")

var EngineDiskInfo = db.define('engine_test_diskinfo_10s', {
    time_bucket: Sequelize.INTEGER,
    diskinfo: Sequelize.TEXT,
    engine_name: Sequelize.TEXT
}, {
    timestamps: false,
    tableName: "engine_test_diskinfo_10s"
});


EngineDiskInfo.findAllByTimeBucket = function (name, time_bucket) {
    return EngineDiskInfo.findAll({
        attributes: ["time_bucket", "diskinfo"],
        order: [["time_bucket", "ASC"]],
        where: {
            engine_name: name,
            time_bucket: {
                $in: time_bucket
            }
        },
        raw: true
    }).then(function (data) {
        var diskinfo_data = []
        var i = 0
        time_bucket.map(function (item) {
            if (i < data.length && item == data[i].time_bucket) {
                diskinfo_data.push(data[i].diskinfo)
                i++
            } else {
                diskinfo_data.push('')
            }
        })
        return diskinfo_data
    })
}

module.exports = EngineDiskInfo
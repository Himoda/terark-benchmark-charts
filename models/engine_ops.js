/**
 * Created by royguo on 4/4/16 AD.
 */

var Sequelize = require("sequelize")

var db = require("./db")

var EngineOps = db.define('engine_test_ops_10s', {
    time_bucket: Sequelize.INTEGER,
    ops: Sequelize.INTEGER,
    ops_type: Sequelize.INTEGER,
    engine_name: Sequelize.TEXT
}, {
    timestamps: false,
    tableName: "engine_test_ops_10s"
});


EngineOps.findAllByName = function (name, duration) {
    var start_time_bucket = parseInt(new Date().getTime()/1000 - duration * 60 * 60)
    return EngineOps.findAll({
        attributes: ["time_bucket", "ops", "ops_type"],
        order: [["time_bucket", "ASC"]],
        where: {
            engine_name: name,
            time_bucket: {
                $gte: start_time_bucket
            }
        },
        raw: true
    }).then(function (data) {
        var result = {
            time_bucket: [],
            ops_total: [],
            ops_read: [],
            ops_insert: [],
            ops_update: []
        }
        var length = -1
        data.reduce(function (previousItem, currentItem, index, array) {
            // 每当遇到新的时间bucket，所有数组增长一位
            if (previousItem == 0 || currentItem.time_bucket != previousItem.time_bucket) {
                length += 1
                result.time_bucket[length] = currentItem.time_bucket
                result.ops_total[length] = 0
                result.ops_read[length] = 0
                result.ops_insert[length] = 0
                result.ops_update[length] = 0
            }
            switch (currentItem.ops_type) {
                case 1:
                    result.ops_read[length] = currentItem.ops
                    break
                case 2:
                    result.ops_insert[length] = currentItem.ops
                    break
                case 3:
                    result.ops_update[length] = currentItem.ops
                    break
            }
            result.ops_total[length] += currentItem.ops
            return currentItem
        }, 0)
        return result
    })
}

module.exports = EngineOps
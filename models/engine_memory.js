/**
 * Created by royguo on 4/4/16 AD.
 */

var Sequelize = require("sequelize")

var db = require("./db")

var EngineMemory = db.define('engine_test_memory_10s', {
    time_bucket: Sequelize.INTEGER,
    free_memory: Sequelize.INTEGER,
    cached_memory: Sequelize.INTEGER,
    used_memory: Sequelize.INTEGER
}, {
    timestamps: false,
    tableName: "engine_test_memory_10s"
});


EngineMemory.findAllByTimeBucket = function (name, time_bucket) {
    return EngineMemory.findAll({
        attributes: ["time_bucket", "total_memory", "free_memory", "cached_memory", "used_memory"],
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
        data.total_memory = []
        data.free_memory = []
        data.cached_memory = []
        data.used_memory = []
        for (var i = 0; i < time_bucket.length; i++) {
            data.total_memory[i] = 40000
            data.free_memory[i] = Math.random() * 10000
            data.cached_memory[i] = Math.random() * 20000
            data.used_memory[i] = Math.random() * 30000
        }
        return data
    })
}

module.exports = EngineMemory
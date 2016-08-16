/**
 * Created by royguo on 4/4/16 AD.
 */

var Sequelize = require("sequelize")

var db = require("./db")

var EngineMemory = db.define('engine_test_memory_10s', {
    time_bucket: Sequelize.INTEGER,
    total_memory: Sequelize.INTEGER,
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
    }).then(function(data){
        result = {}
        result.total_memory = []
        result.free_memory = []
        result.cached_memory = []
        result.used_memory = []
        var i = 0
        time_bucket.map(function (item) {
            if(i < data.length && item == data[i].time_bucket) {
                result.total_memory.push(data[i].total_memory)
                result.free_memory.push(data[i].free_memory)
                result.cached_memory.push(data[i].cached_memory)
                result.used_memory.push(data[i].used_memory)
                i++
            }else{
                result.total_memory.push('')
                result.free_memory.push('')
                result.cached_memory.push('')
                result.used_memory.push('')
            }
        })
        return result
    })
}

module.exports = EngineMemory
// index.js
/**
 * render ./views/index.html
 */

var express = require('express')
var EngineOps = require('../models/engine_ops')
var EngineCpu = require('../models/engine_cpu')
var EngineMemory = require('../models/engine_memory')

var router = express.Router()


/******* html render *******/

router.get('/?', function (req, resp) {
    resp.redirect('/engine')
})

router.get('/engine', function (req, resp) {
    resp.render('engine')
})



/******* JSON API *******/

/**
 * 获取引擎的测试数据
 */
router.post('/api/engine', function (req, resp) {
    var name = req.body.engine        // terarkdb, wiredtiger, rocksdb
    var duration = req.body.duration  // x hours
    var result = {}
    EngineOps.findAllByName(name, duration).then(function (ops_data) {
        result = ops_data
        return EngineCpu.findAllByTimeBucket(name, result.time_bucket)
    }).then(function (cpu_usage) {
        result.cpu_usage = cpu_usage
        return EngineMemory.findAllByTimeBucket(name, result.time_bucket)
    }).then(function (memory_data) {
        result.total_memory = memory_data.total_memory
        result.free_memory = memory_data.free_memory
        result.cached_memory = memory_data.cached_memory
        result.used_memory = memory_data.used_memory
        resp.json(result)
    })
})

module.exports = router
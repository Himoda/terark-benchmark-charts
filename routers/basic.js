// index.js
/**
 * render ./views/index.html
 */

var express = require('express')
var EngineOps = require('../models/engine_ops')
var EngineCpu = require('../models/engine_cpu')
var EngineMemory = require('../models/engine_memory')
var EngineDBSize = require('../models/engine_dbsize')
var EngineDiskInfo = require('../models/engine_diskinfo')

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
    var step = req.body.step / 10     // 1 / 3 / 6 / 60
    var result = {}
    EngineOps.findAllByName(name, duration).then(function (ops_data) {
        result = ops_data
        return EngineCpu.findAllByTimeBucket(name, result.time_bucket)
    }).then(function (cpu_data) {
        result.cpu_usage = cpu_data.usage
        result.cpu_iowait = cpu_data.iowait
        return EngineMemory.findAllByTimeBucket(name, result.time_bucket)
    }).then(function (memory_data) {
        result.total_memory = memory_data.total_memory
        result.free_memory = memory_data.free_memory
        result.cached_memory = memory_data.cached_memory
        result.used_memory = memory_data.used_memory
        return EngineDBSize.findAllByTimeBucket(name, result.time_bucket)
    }).then(function (dbsize_data) {
        result.dbsize = dbsize_data
        return EngineDiskInfo.findAllByTimeBucket(name, result.time_bucket)
    }).then(function (diskinfo_data) {
        result.diskinfo = diskinfo_data

        // 按照step，merge数据
        if (step > 1) {
            // 遍历所有的key，如diskinfo, dbsize等
            for (var k in result) {
                var data = []
                var tmp = 0
                // 遍历每一个key中的所有数据, 求平均
                for (var i = 0; i < result[k].length; i++) {
                    // 文本数据直接保存最后一个数据
                    if (typeof result[k][i] != 'number') {
                        if (i % step == step - 1) {
                            data.push(result[k][i])
                        }
                        continue
                    }

                    if (i % step == 0) {
                        tmp = result[k][i]
                    } else if (i % step == step - 1) {
                        tmp += result[k][i]
                        data.push(parseInt(tmp / step))
                    } else {
                        tmp += result[k][i]
                    }
                }
                result[k] = data
            }
        }

        result.time_bucket = result.time_bucket.map(function (item) {
            var date = new Date(1970, 0, 1)
            date.setSeconds(item + 8 * 60 * 60)
            return dateFormat(date, "yyyy-MM-dd hh:mm:ss")
        })

        resp.json(result)
    })
})

router.post('/api/engine/latency', function (req, resp) {
    var name = req.body.engine        // terarkdb, wiredtiger, rocksdb
    var duration = req.body.duration  // x hours
    var step = req.body.step / 10     // 1 / 3 / 6 / 60
    var result = {}
})

/**
 * 日期转换，从CST转换成格式化的日期
 */
var dateFormat = function (date, fmt) { //author: meizz
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

module.exports = router
// index.js
/**
 * render ./views/index.html
 */

var express = require('express')
var Engine = require('../models/engine')

var router = express.Router()


/** html render **/
router.get('/engine/:name', function (req, resp) {
    var name = req.params.name
    resp.render('engine', {name: name})
})

/** JSON API **/

router.post('/api/engine', function (req, resp) {
    var name = req.body.engine        // terarkdb, wiredtiger, rocksdb
    Engine.findAllByName(name).then(function (result) {
        resp.json(result)
    })
})

module.exports = router
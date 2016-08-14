// server.js
/**
 * Entry of this applicaiton.
 */
var express = require('express')
var swig = require('swig')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')

var config = require('./config')

swig.setDefaults({
    cache: false
})


var app = express()
// enable template engine based on the directory `views/`
app.engine('html', swig.renderFile)
app.set('view engine', 'html')
app.set('views', __dirname + '/views')

// disable express cache(one of swig/express cache should be enabled in production mode)
app.set('view cache', !config.isDevMode);
app.use(cookieParser())
// serve static files
app.use('/asserts', express.static('asserts'))
app.use('/*favicon.ico', express.static('asserts/favicon.ico'))

// 全局json parser, usage : req.body
app.use(bodyParser.json())

// TODO: 参数需要更多研究(https://github.com/expressjs/session#options)
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'hello',
    cookie: {maxAge: 30 * 24 * 60 * 60 * 1000}
}))

// init routers
initRouters()

// start server
require('./models/db')
var server = app.listen(config.port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("your server is listening at http://%s:%s", host, port)
})


/**
 * routers
 */
function initRouters() {
    app.use('', require('./routers/basic'))
}
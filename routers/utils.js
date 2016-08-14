// utils.js

var express = require('express')
var captchapng = require('captchapng');
var ResponseEntity = require('./common/response_entity')

var router = express.Router()


// 图片验证码生成，并记录验证码到session
router.get('/captcha/:type', function (req, resp) {
    var type = req.params.type

    // 暂存验证码到session
    var number = parseInt(Math.random() * 9000 + 1000);
    req.session['captcha_' + type] = number  // 注册或登陆的时候，验证此字符串
    // 生成验证码
    var p = new captchapng(100, 40, number);
    p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

    var base64 = new Buffer(p.getBase64(), 'base64')
    resp.writeHead(200, {
        'Content-Type': 'image/png'
    });
    resp.end(base64);
})

// 短信验证码发送
router.get('/msg/:type/:tel', function (req, resp) {
    var number = parseInt(Math.random() * 9000 + 1000);
    req.session['msg_captcha_' + req.params.type + "_" + req.params.tel] = number

    // TODO 调用远程API发送短信验证码
    console.log("发送短信：" + req.params.tel + ", 验证码：" + number)

    resp.json(ResponseEntity.build())
})


module.exports = router
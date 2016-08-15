// common.js

// global configs
$.config = {}

$(function () {

});

/**
 * 通用的，短信发送按钮生成器
 * @param element
 * @param timeout
 * @param type register
 * @param tel_element
 * @constructor
 */
function InitMsgSend(element, timeout, type, tel_element) {
    var count = timeout
    var originalText = $(element).text()
    var event = function () {
        if(tel_element.val().length != 11) {
            alert("手机号码必须是11位!")
            return
        }

        $(element).addClass("disabled")
        $(element).unbind("click")
        $(element).text(count)
        var id = setInterval(function () {
            $(element).text(--count)
            if (count == 0) {
                clearInterval(id)
                $(element).click(event)
                $(element).removeClass("disabled")
                $(element).text(originalText)
                count = timeout
            }
        }, 1000)

        // 后台发送短信
        $.ajax({
            type: "GET",
            url: "/utils/msg/" + type + "/" + tel_element.val(),
            contentType: "application/json",
            async: true,
            dataType: "json",
            success: function (response) {
                if (response.status == 200) {
                    alert("短信已发送, 请查收")
                } else {
                    alert(response.msg)
                }
            }
        })
    }
    $(element).click(event)
}

/**
 * var time1 = new Date().Format("yyyy-MM-dd");
 * var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");
 * @param fmt
 * @returns {*}
 * @constructor
 */
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
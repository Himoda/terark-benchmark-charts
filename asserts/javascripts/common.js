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
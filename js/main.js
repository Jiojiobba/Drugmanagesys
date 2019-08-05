$(document).ready(function($) {
    getUser();
});

var token = localStorage.getItem('token');
// 初始化用户
function getUser() {
    if (!localStorage.token) {
        layer.msg("登录超时，请重新登录！", {
            time: 2000,
        });
        // location.href = "login.html";
    }
    loginornot()
}
//验证身份是否失效
function loginornot() {
    if (!localStorage.token) {
        layer.msg("登录超时，请重新登录", {
            time: 2000,
        });
    }
}
//退出按钮
$("#logout").on('click', function() {
    window.location.href = "login.html";
    localStorage.clear();
});
//登陆
function login() {
    $.ajax({
        type: "POST",
        url: "http://106.12.3.28/admin/login",
        dataType: "json",
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(obj),
        success: function(data) {
            if (data.status == 400) {
                layer.msg(data.msg, {
                    time: 2000,
                });
                $("#login_password").val('');
            } else {
                layer.msg("登陆成功", {
                    time: 2000,
                });
                localStorage.token = data.data.token;
                localStorage.username = obj.username;

                localStorage.logged = true;
                obj.username = "";
                obj.password = "";
            }

        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
        },
    })
};
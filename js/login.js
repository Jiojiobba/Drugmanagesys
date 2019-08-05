$(function() {});
var obj = { "username": "", "password": "" };
//登录按钮点击事件
$("#login_botton").on("click", function() {
    obj.username = $("input[name='username']").val();
    obj.password = $("input[name='password']").val();
    login();
});

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
                location.href = "main.html";
            }
            //添加图片

        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            $("#login_password").val('');
        },
    })
};
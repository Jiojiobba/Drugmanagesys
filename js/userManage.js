var token = localStorage.getItem('token');
var username = localStorage.getItem('username');
var userallinfo; //药品信息数组
var pageSum; //总页码
var pageSize; //每页信息数
var searchcontent; //搜索内容
var searchflag = 0; //是否正在搜索
var dangqianpage; //当前页面
var addusertt; //弹窗
var usernameadd; //新增管理员
var userpsdadd;
var usernameedit; //修改密码
var userpsdedit;
pageSize = 9;

$(function() {
    loginornot();
    loadpage();
    ajaxgetalluser(1, pageSize, "", 0);
});
var mainindex;
//验证身份是否失效
function loginornot() {
    if (!localStorage.token) {
        layer.msg("登录超时，请重新登录", {
            time: 2000,
        });
    }
}
//新增管理员按钮
$("#add_user").on("click", function() {
    loginornot();
    //捕获页
    var index = layer.open({
        type: 1,
        shade: false,
        title: false, //不显示标题
        content: $('.layer_notice'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
        cancel: function() {
            $(".layer_notice").css("display", "none");
            layer.close(index);
        }
    });
    // mainindex = index;
    // $("#customer_add").on("click", function() {
    //     usernameadd = "";
    //     userpsdadd = "";
    //     usernameadd = $("input[name = 'usernameadd']").val();
    //     userpsdadd = $("input[name = 'userpsdadd']").val();
    //     var index2 = layer.load(1, {
    //         shade: [0.1, '#fff'] //0.1透明度的白色背景
    //     });
    //     adduser();
    //     layer.close(index2);
    //     layer.close(index);

    //     $(".layer_notice").css("display", "none");
    //     $("#layer_notice_add").css("display", "none");

    // });

});
//确认添加按钮触发函数
function addbuttonclick() {
    usernameadd = "";
    userpsdadd = "";
    usernameadd = $("input[name = 'usernameadd']").val();
    userpsdadd = $("input[name = 'userpsdadd']").val();
    var index2 = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    adduser();
    layer.close(index2);
    layer.closeAll();

    $(".layer_notice").css("display", "none");
    $("#layer_notice_add").css("display", "none");

}
// $("#customer_add").on("click", function() {

// });
//新增管理员
function adduser() {
    loginornot();
    var dd = {
        "username": usernameadd,
        "password": userpsdadd
    };
    $.ajax({
        type: "POST",
        url: "http://106.12.3.28/admin/administrator",
        dataType: "json",
        data: JSON.stringify(dd),
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        success: function(data) {
            if (data.status == 200) {
                $("input[name = 'usernameadd']").val("");
                $("input[name = 'userpsdadd']").val("");
                // usertablerender();
                layer.msg(data.msg, { time: 2000 });

                ajaxgetalluser(1, pageSize, "", 0);
                pagefenye(0);

            } else {
                layer.msg(data.msg, { time: 2000 });
                layui.layer.closeAll();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("新增管理员失败", {
                time: 2000,
            });
        },
    });
}

//搜索
$("#searchall").on("click", function() {
    loginornot();
    searchcontent = $("input[name = 'searchuser']").val();
    searchcontent = $.trim(searchcontent); //去除首尾空格
    if (searchcontent == "") searchflag = 0;
    else searchflag = 1;
    // search();
    ajaxgetalluser(1, pageSize, searchcontent, 1);
    pagefenye(1);
});
//获取管理员信息ajax请求
function ajaxgetalluser(page, pagesize, kkey, serachflag) {
    loginornot();
    var alldrug;
    dangqianpage = page;
    if (serachflag == 1) {
        $.ajax({
            type: "GET",
            url: "http://106.12.3.28/admin/administrators?" + "&page=" + page + "&pageSize=" + pagesize + "&key=" + kkey,
            dataType: "json",
            headers: { 'Content-Type': 'application/json', "username": username, "token": token },
            // data: JSON.stringify(Getalldrug),
            success: function(data) {
                if (data.status == 200) {
                    userallinfo = data.data.list;
                    pageSum = data.data.amount;
                    usertablerender();
                    if (page == 1) {
                        pagefenye(1);
                    }
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown, data) {
                console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
                layer.msg("获取管理员信息失败！", {
                    time: 2000,
                });
            },
        });
    } else {
        $.ajax({
            type: "GET",
            url: "http://106.12.3.28/admin/administrators?" + "&page=" + page + "&pageSize=" + pagesize,
            dataType: "json",
            headers: { 'Content-Type': 'application/json', "username": username, "token": token },
            success: function(data) {
                if (data.status == 200) {
                    userallinfo = data.data.list;
                    if (pageSum != data.data.amount) {
                        pageSum = data.data.amount;
                        pagefenye(0);
                    }
                    pageSum = data.data.amount;
                    usertablerender();
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown, data) {
                console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
                layer.msg("获取管理员信息失败！", {
                    time: 2000,
                });
            },
        });
    }

};

//搜索
function search() {
    loginornot();
    $.ajax({
        type: "GET",
        url: "http://106.12.3.28/admin/administrators?" + "&key=" + searchcontent,
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        success: function(data) {
            if (data.status == 200) {
                userallinfo = data.data.list;
                pageSum = data.data.amount;
                searchcontent = " ";
                usertablerender();
                pagefenye(1);
            } else {
                layer.msg(data.msg, {
                    time: 2000,
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("搜索失败", {
                time: 2000,
            });
        },
    });
};
//页面加载时的分页
function loadpage() {
    loginornot();
    var index = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    usertablerender();
    pagefenye();
    $.ajax({
        type: "GET",
        url: "http://106.12.3.28/admin/administrators?" + "&page=" + 1 + "&pageSize=" + pageSize,
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        success: function(data) {
            if (data.status == 200) {
                userallinfo = data.data.list;
                pageSum = data.data.amount;
                pagefenye(0);
                usertablerender();
                layer.close(index);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("加载失败！", {
                time: 2000,
            });
            layer.close(index);
        },
    });
};

//分页
function pagefenye(flag) {
    loginornot();
    layui.use(['laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider'], function() {
        var laypage = layui.laypage, //分页
            layer = layui.layer, //弹层
            table = layui.table, //表格
            element = layui.element; //元素操作
        // var loadd = layui.layer.load(1); //添加laoding,0-2两种方式
        //分页
        laypage.render({
            elem: 'fenpage', //分页容器的id
            count: pageSum, //总页数
            limit: pageSize,
            skin: '#1E9FFF', //自定义选中色值
            //,skip: true //开启跳页
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                if (!first) {
                    dangqianpage = obj.curr;
                    if (flag == 1) {
                        ajaxgetalluser(obj.curr, pageSize, searchcontent, 1)
                    } else {
                        ajaxgetalluser(obj.curr, pageSize, "", 0)
                    }
                }
            },

        });
        layer.closeAll('loading');
    });
};
//管理员信息表格渲染
function usertablerender() {
    loginornot();
    layui.use(['laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider'], function() {
        var laydate = layui.laydate, //日期
            laypage = layui.laypage, //分页
            layer = layui.layer, //弹层
            table = layui.table, //表格
            upload = layui.upload, //上传
            element = layui.element; //元素操作
        var loadd = layui.layer.load(1); //添加laoding,0-2两种方式


        table.render({
            elem: '#user_table',
            toolbar: false, //工具栏
            title: '药品信息表',
            height: 385,
            limit: pageSize, //每页显示条数
            // page: true,
            totalRow: false,
            loading: false,
            cols: [
                [
                    { field: 'username', title: '用户名' },
                    {
                        field: 'lastLoginTime',
                        title: '最后登陆时间',
                        templet: function(d) {
                            let oDate = new Date(d.lastLoginTime),
                                oYear = oDate.getFullYear(),
                                oMonth = oDate.getMonth() + 1,
                                oDay = oDate.getDate(),
                                oHour = oDate.getHours(),
                                oMinutes = oDate.getMinutes(),
                                oSeconds = oDate.getSeconds(),
                                oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMinutes) + ':' + getzf(oSeconds); //最后拼接时间
                            return oTime;
                        }
                    },
                    { fixed: 'right', title: '操作', toolbar: '#barDemo', width: 110 }
                ]
            ],
            data: userallinfo,

        });
        layer.closeAll('loading');

        //修改删除工具栏监听
        table.on('tool(user-table)', function(obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            let temp;
            temp = obj.data.username;
            //删除
            if (obj.event === 'del') {
                layer.confirm('确认删除？',
                    function(index, layero) { //确认
                        deleteuser(temp);
                        layer.close(index);
                    },
                    function(index) { //取消
                        layer.close(index);
                    });
            } else if (obj.event === 'edit') {
                $("input[name = 'usernameedit']").val(temp);
                var index = layer.open({
                    type: 1,
                    shade: false,
                    title: false, //不显示标题
                    content: $('.layer_passedit'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
                    cancel: function() {
                        layer.close(index);
                        $("#editpassword").css("display", "none");
                        $(".layer_passedit").css("display", "none");
                    }
                });

            }

        });

    });
};

function editbuttonclick() {
    usernameedit = "";
    userpsdedit = "";
    usernameedit = $("input[name = 'usernameedit']").val();
    userpsdedit = $("input[name = 'userpsdedit']").val();
    var index2 = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    edituser();
    layer.close(index2);
    layer.closeAll();

    $("#editpassword").css("display", "none");
    $(".layer_passedit").css("display", "none");

};
//修改密码
function edituser() {
    var dd = {
        "username": usernameedit,
        "password": userpsdedit
    };
    $.ajax({
        type: "POST",
        url: "http://106.12.3.28/admin/administrator/modifyPassword",
        dataType: "json",
        data: JSON.stringify(dd),
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        success: function(data) {

            if (data.status == 200) {
                ss = $("input[name = 'searchuser']").val();

                if (ss == "") { ajaxgetalluser(dangqianpage, pageSize, ss, 0); } else {
                    ajaxgetalluser(dangqianpage, pageSize, ss, 1);
                }
                $("input[name = 'usernameedit']").val("");
                $("input[name = 'userpsdedit']").val("");
                layer.msg(data.msg, { time: 2000 });
            } else {
                layer.msg(data.msg, { time: 2000 });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("修改密码失败", {
                time: 2000,
            });
        },
    });
};
//删除用户
function deleteuser(name) {
    loginornot();
    $.ajax({
        type: "DELETE",
        url: "http://106.12.3.28/admin/administrator?" + "username=" + name,
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        success: function(data) {
            if (data.status == 200) {
                pagefenye(0);
                ajaxgetalluser(1, pageSize, searchcontent, searchflag);
                layer.msg("删除成功", {
                    time: 2000,
                });
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("删除失败", {
                time: 2000,
            });
        },
    });
};

function getzf(num) {
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
}
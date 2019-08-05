var token = localStorage.getItem('token');
var username = localStorage.getItem('username');
var mmoremenucontent; //新增更多菜单内容
var userallinfo; //药品信息数组
var pageSum; //总页码
var pageSize; //每页信息数
var searchcontent; //搜索内容
var searchflag = 0; //是否正在搜索
var dangqianpage; //当前页面
var addusertt; //弹窗
var usernameadd;
var userpsdadd;
pageSize = 9;
// $(document).ready(function($) {
//     getAllUser();
// });

$(function() {
    if (!localStorage.token) {
        alert("登录超时，请重新登录！");
        location.href = "index.html";
    }
    // loadpage();
    ajaxgetallmenu();
});
//新增菜单按钮
$("#add_menu").on("click", function() {
    mmoremenucontent = $("input[name = 'moremenuname']").val();
    mmoremenucontent = $.trim(mmoremenucontent); //去除首尾空格

    if (mmoremenucontent == "") {
        layer.msg("新增菜单不能为空", {
            time: 2000,
        });
    } else {
        var dd = {
            "menuName": mmoremenucontent,
        };
        $.ajax({
            type: "POST",
            url: "http://106.12.3.28/admin/moreMenu",
            dataType: "json",
            headers: { 'Content-Type': 'application/json', "username": username, "token": token },
            data: JSON.stringify(dd),
            success: function(data) {
                if (data.status == 200) {
                    // moremenudisplay(data.data)
                    $("#mmore").empty();
                    ajaxgetallmenu();
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown, data) {
                console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
                layer.msg("新增菜单失败", {
                    time: 2000,
                });
            },
        });
    }

});
//增加药品
$("#add_user").on("click", function() {
    //捕获页
    var index = layer.open({
        type: 1,
        shade: false,
        title: false, //不显示标题
        content: $('.layer_notice'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
        cancel: function() {
            // layer.msg('捕获就是从页面已经存在的元素上，包裹layer的结构', { time: 5000, icon: 6 });
        }
    });
    $("#customer_add").on("click", function() {
        usernameadd = $("input[name = 'usernameadd']").val();
        userpsdadd = $("input[name = 'userpsdadd']").val();
        adduser();
        layer.close("index");
    });

});
//获取药品信息ajax请求
function ajaxgetallmenu() {
    var alldrug;
    // dangqianpage = page;
    $.ajax({
        type: "GET",
        url: "http://106.12.3.28/admin/moreMenus",
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        // data: JSON.stringify(Getalldrug),
        success: function(data) {
            if (data.status == 200) {
                moremenudisplay(data.data)
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("获取药品信息失败！", {
                time: 2000,
            });
        },
    });
};
//更多菜单渲染表格
function moremenudisplay(moreData) {
    for (var i = 0; i < moreData.length; i++) {
        document.getElementById("mmore").innerHTML += "<div class=\"moremenuson\">" + moreData[i] + "</div>";
    }

}

//新增管理员
function adduser() {
    var dd = {
        "username": usernameadd,
        "password": userpsdadd
    };
    var jj = JSON.stringify(dd);
    $.ajax({
        type: "POST",
        url: "http://106.12.3.28/admin/administrator",
        // url: "http://106.12.3.28/admin/administrator" + "username=" +  + "&password=" + ,
        dataType: "json",
        data: JSON.stringify(dd),
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        success: function(data) {
            if (data.status == 200) {
                usernameadd = "";
                userpsdadd = "";
                getalldrug();
                // pagefenye(1);
                layer.msg(data.msg);
            } else {}
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
$("#research_drug").on("click", function() {
    searchcontent = $("input[name = 'searchinput']").val();
    searchcontent = $.trim(searchcontent); //去除首尾空格
    if (searchcontent == "") searchflag = 0;
    else searchflag = 1;
    // search();
    ajaxgetalldrug(1, pageSize, searchcontent, 1);
    pagefenye(1);
});

//搜索
function search() {
    $.ajax({
        type: "GET",
        url: "http://106.12.3.28/admin/administrators?" + "&key=" + searchcontent,
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        success: function(data) {
            if (data.status == 200) {
                drugallinfo = data.data.list;
                pageSum = data.data.amount;
                searchcontent = " ";
                getalldrug();
                pagefenye(1);
            } else {}
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
    $.ajax({
        type: "GET",
        url: "http://106.12.3.28/admin/moreMenus",
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        success: function(data) {
            if (data.status == 200) {
                userallinfo = data.data;
                pageSum = data.data.length;
                pagefenye(0);
                getalldrug();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            // layer.msg("分页失败！", {
            //     time: 2000,
            // });
        },
    });
};




//分页
function pagefenye(flag) {
    layui.use(['laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider'], function() {
        var laypage = layui.laypage, //分页
            layer = layui.layer, //弹层
            table = layui.table, //表格
            element = layui.element; //元素操作
        var loadd = layui.layer.load(1); //添加laoding,0-2两种方式

        //分页
        laypage.render({
            elem: 'fenpage', //分页容器的id
            count: pageSum, //总页数
            skin: '#1E9FFF', //自定义选中色值
            //,skip: true //开启跳页
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                if (!first) {
                    dangqianpage = obj.curr;
                    if (flag == 1) {

                        ajaxgetalldrug(obj.curr, pageSize, searchcontent, 1)

                    } else {
                        ajaxgetalldrug(obj.curr, pageSize, "", 0)
                    }
                }
            },

        });
        layer.closeAll('loading');
    });
};
//药品信息表格渲染
function getalldrug() {
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
            title: '更多菜单表',
            height: 385,
            limit: pageSize, //每页显示条数
            // page: true,
            totalRow: false,
            loading: true,
            cols: [
                [
                    { title: '菜单名' },
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
            } else if (
                obj.event === 'edit') //修改
            {
                location.href = "editDrug.html?" + temp;
            }

        });

    });
};
//删除管理员
function deleteuser(name) {
    $.ajax({
        type: "DELETE",
        url: "http://106.12.3.28/admin/administrator?" + "username=" + name,
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        success: function(data) {
            if (data.status == 200) {
                ajaxgetalldrug(dangqianpage, pageSize, searchcontent, searchflag);
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
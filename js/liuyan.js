var token = localStorage.getItem('token');
var username = localStorage.getItem('username');
var userallinfo; //药品信息数组
var pageSum; //总页码
var pageSize; //每页信息数
var searchcontent; //搜索内容
var searchflag = 0; //是否正在搜索
var dangqianpage; //当前页面
pageSize = 9;

$(function() {
    loginornot();
    loadpage();
    // ajaxgetalluser(1, pageSize);
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
//页面加载时的分页
function loadpage() {
    loginornot();
    var index = layer.load(1, {
        shade: [0.1, '#fff'] //0.1透明度的白色背景
    });
    // usertablerender();
    // pagefenye();
    $.ajax({
        type: "GET",
        url: "http://106.12.3.28/admin/userMessages?" + "&page=" + 1 + "&pageSize=" + pageSize,
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        success: function(data) {
            if (data.status == 200) {
                userallinfo = data.data.list;
                pageSum = data.data.amount;
                pagefenye();
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

//获取管理员信息ajax请求
function ajaxgetalluser(page, pagesize) {
    loginornot();
    var alldrug;
    dangqianpage = page;
    $.ajax({
        type: "GET",
        url: "http://106.12.3.28/admin/userMessages?" + "&page=" + page + "&pageSize=" + pagesize,
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        success: function(data) {
            if (data.status == 200) {
                userallinfo = data.data.list;
                pageSum = data.data.amount;
                usertablerender();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("获取表格失败！", {
                time: 2000,
            });
        },
    });


};


//分页
function pagefenye() {
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
                    ajaxgetalluser(obj.curr, pageSize)
                }
            },

        });
        layer.closeAll();
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
            title: '用户留言信息表',
            height: 385,
            limit: pageSize, //每页显示条数
            // page: true,
            totalRow: false,
            loading: false,
            cols: [
                [
                    { field: 'id', title: 'ID' },
                    { field: 'nickname', title: '用户昵称' },
                    { field: 'content', title: '留言内容' },
                    {
                        field: 'date',
                        title: '日期',
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
                ]
            ],
            data: userallinfo,
        });
        layer.closeAll('loading');

    });
};

function getzf(num) {
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
}
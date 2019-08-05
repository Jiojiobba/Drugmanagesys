var token = localStorage.getItem('token');
var username = localStorage.getItem('username');
var diaryall; //药品信息数组
var pageSum; //总页码
var pageSize; //每页信息数
var searchuser, searchoperation; //搜索内容
var searchflag = 0; //是否正在搜索
var dangqianpage; //当前页面
pageSize = 9;
$(function() {
    if (!localStorage.token) {
        alert("登录超时，请重新登录！");
        location.href = "index.html";
    }
    loadpage();
    ajaxgetalldiary(1, pageSize);
    getalldiary();
    // ajaxgetalldiary(1, 9, "admin", "新建日志", 1);
});
//搜索
$("#searchall").on("click", function() {
    searchuser = $("input[name = 'searchuser']").val();
    searchoperation = $("input[name = 'searchoperation']").val();

    searchuser = $.trim(searchuser); //去除首尾空格
    searchoperation = $.trim(searchoperation); //去除首尾空格

    if (searchuser == "" && searchoperation == "") searchflag = 0;
    else searchflag = 1;
    // search();
    ajaxgetalldiary(1, pageSize, searchuser, searchoperation, 1);
    pagefenye(1);
});

//页面加载时的分页
function loadpage() {
    // pagefenye(0);
    $.ajax({
        type: "GET",
        url: "http://106.12.3.28/admin/logs?page=1" + "&pageSize=" + pageSize,
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        success: function(data) {
            if (data.status == 200) {
                diaryall = data.data.list;
                pageSum = data.data.amount;
                pagefenye(0);
                getalldiary();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("加载失败！", {
                time: 2000,
            });
        },
    });
};

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
            limit: pageSize,
            skin: '#1E9FFF', //自定义选中色值
            //,skip: true //开启跳页
            layout: ['count', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                if (!first) {
                    dangqianpage = obj.curr;
                    if (flag == 1) { //在搜索的跳转页面
                        ajaxgetalldiary(obj.curr, pageSize, searchuser, searchoperation, 1)
                    } else {
                        ajaxgetalldiary(obj.curr, pageSize, "", "", 0)
                    }
                }
            },

        });
        layer.closeAll('loading');
    });
};

function ajaxgetalldiary(page, pagesize, searchuser, searchoperation, serachflag) {
    dangqianpage = page;
    if (serachflag == 1) {
        $.ajax({
            type: "GET",
            url: "http://106.12.3.28/admin/logs?username=" + searchuser + "&operation=" + searchoperation + "&page=" + page + "&pageSize=" + pageSize,
            dataType: "json",
            headers: { 'Content-Type': 'application/json', "username": username, "token": token },
            // data: JSON.stringify(Getalldrug),
            success: function(data) {
                if (data.status == 200) {
                    pageSum = data.data.amount;
                    diaryall = data.data.list;
                    getalldiary();
                    if (page == 1) {
                        pagefenye(1);
                    }
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown, data) {
                console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
                layer.msg("获取操作日志失败！", {
                    time: 2000,
                });
            },
        });
    } else {
        $.ajax({
            type: "GET",
            url: "http://106.12.3.28/admin/logs?page=" + page + "&pageSize=" + pageSize,
            dataType: "json",
            headers: { 'Content-Type': 'application/json', "username": username, "token": token },
            success: function(data) {
                if (data.status == 200) {
                    diaryall = data.data.list;
                    pageSum = data.data.amount;
                    getalldiary();
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown, data) {
                console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
                layer.msg("获取操作日志失败！", {
                    time: 2000,
                });
            },
        });
    }
};

//药品信息表格渲染
function getalldiary() {
    layui.use(['laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider'], function() {
        var laydate = layui.laydate, //日期
            laypage = layui.laypage, //分页
            layer = layui.layer, //弹层
            table = layui.table, //表格
            upload = layui.upload, //上传
            element = layui.element; //元素操作
        var loadd = layui.layer.load(1); //添加laoding,0-2两种方式

        //操作信息表格渲染

        table.render({
            elem: '#operaton_table',
            toolbar: false,
            title: '操作日志信息表',
            height: 385,
            limit: pageSize,
            totalRow: false,
            loading: true,
            cols: [
                [
                    { field: 'id', title: '用户id' },
                    { field: 'username', title: '用户名' },
                    { field: 'operation', title: '操作' },
                    {
                        field: 'operationDate',
                        title: '操作时间',
                        sort: true,
                        templet: function(d) {
                            let oDate = new Date(d.operationDate),
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
            // page: true,
            data: diaryall
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

// var token = localStorage.getItem('token');
// var username = localStorage.getItem('username');
// var diaryall; //药品信息数组
// var pageSum; //总页码
// var pageSize; //每页信息数
// var searchuser, searchoperation; //搜索内容
// var searchflag = 0; //是否正在搜索
// var dangqianpage; //当前页面
// pageSize = 9;
// $(function() {
//     if (!localStorage.token) {
//         alert("登录超时，请重新登录！");
//         location.href = "index.html";
//     }
//     loadpage();
//     ajaxgetalldiary(1, pageSize);
//     getalldiary();
//     // ajaxgetalldiary(1, 9, "admin", "新建日志", 1);
// });
// //搜索
// $("#searchall").on("click", function() {
//     searchuser = $("input[name = 'searchuser']").val();
//     searchoperation = $("input[name = 'searchoperation']").val();

//     searchuser = $.trim(searchuser); //去除首尾空格
//     searchoperation = $.trim(searchoperation); //去除首尾空格

//     if (searchuser == "" && searchoperation == "") searchflag = 0;
//     else searchflag = 1;
//     // search();
//     ajaxgetalldiary(1, pageSize, searchuser, searchoperation, 1);
//     pagefenye(1);
// });

// //页面加载时的分页
// function loadpage() {

//     $.ajax({
//         type: "GET",
//         url: "http://106.12.3.28/admin/logs?page=1" + "&pageSize=" + pageSize,
//         dataType: "json",
//         headers: { 'Content-Type': 'application/json', "username": username, "token": token },
//         success: function(data) {
//             if (data.status == 200) {
//                 diaryall = data.data.list;
//                 pageSum = data.data.amount;
//                 pagefenye(0);
//                 getalldiary();
//             }
//         },
//         error: function(XMLHttpRequest, textStatus, errorThrown, data) {
//             console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
//             layer.msg("分页失败！", {
//                 time: 2000,
//             });
//         },
//     });
// };

// function pagefenye(flag) {
//     layui.use(['laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider'], function() {
//         var laypage = layui.laypage, //分页
//             layer = layui.layer, //弹层
//             table = layui.table, //表格
//             element = layui.element; //元素操作
//         var loadd = layui.layer.load(1); //添加laoding,0-2两种方式

//         //分页
//         laypage.render({
//             elem: 'fenpage', //分页容器的id
//             count: pageSum, //总页数
//             skin: '#1E9FFF', //自定义选中色值
//             //,skip: true //开启跳页
//             layout: ['count', 'prev', 'page', 'next', 'skip'],
//             jump: function(obj, first) {
//                 if (!first) {
//                     dangqianpage = obj.curr;
//                     if (flag == 1) { //在搜索的跳转页面
//                         ajaxgetalldiary(obj.curr, pageSize, searchuser, searchoperation, 1)
//                     } else {
//                         ajaxgetalldiary(obj.curr, pageSize, "", "", 0)
//                     }
//                 }
//             },

//         });
//         layer.closeAll('loading');
//     });
// };

// function ajaxgetalldiary(page, pagesize, searchuser, searchoperation, serachflag) {
//     dangqianpage = page;
//     if (serachflag == 1) {
//         $.ajax({
//             type: "GET",
//             url: "http://106.12.3.28/admin/logs?username=" + searchuser + "&operation=" + searchoperation + "&page=" + page + "&pageSize=" + pageSize,
//             dataType: "json",
//             headers: { 'Content-Type': 'application/json', "username": username, "token": token },
//             // data: JSON.stringify(Getalldrug),
//             success: function(data) {
//                 if (data.status == 200) {
//                     pageSum = data.data.amount;
//                     diaryall = data.data.list;
//                     getalldiary();
//                     if (page == 1) {
//                         pagefenye(1);
//                     }
//                 }
//             },
//             error: function(XMLHttpRequest, textStatus, errorThrown, data) {
//                 console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
//                 layer.msg("获取药品信息失败！", {
//                     time: 2000,
//                 });
//             },
//         });
//     } else {
//         $.ajax({
//             type: "GET",
//             url: "http://106.12.3.28/admin/logs?page=" + page + "&pageSize=" + pageSize,
//             dataType: "json",
//             headers: { 'Content-Type': 'application/json', "username": username, "token": token },
//             success: function(data) {
//                 if (data.status == 200) {
//                     diaryall = data.data.list;
//                     pageSum = data.data.amount;
//                     getalldiary();
//                 }
//             },
//             error: function(XMLHttpRequest, textStatus, errorThrown, data) {
//                 console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
//                 layer.msg("获取操作日志失败！", {
//                     time: 2000,
//                 });
//             },
//         });
//     }
// };

// //药品信息表格渲染
// function getalldiary() {
//     layui.use(['laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider'], function() {
//         var laydate = layui.laydate, //日期
//             laypage = layui.laypage, //分页
//             layer = layui.layer, //弹层
//             table = layui.table, //表格
//             upload = layui.upload, //上传
//             element = layui.element; //元素操作
//         var loadd = layui.layer.load(1); //添加laoding,0-2两种方式

//         //操作信息表格渲染

//         table.render({
//             elem: '#operaton_table',
//             toolbar: false,
//             title: '操作日志信息表',
//             height: 385,
//             limit: pageSize,
//             totalRow: false,
//             loading: true,
//             cols: [
//                 [
//                     { field: 'id', title: 'ID' },
//                     { field: 'username', title: '用户名' },
//                     { field: 'operation', title: '操作' },
//                     {
//                         field: 'operationDate',
//                         title: '操作时间',
//                         sort: true,
//                         templet: function(d) {
//                             let oDate = new Date(d.operationDate),
//                                 oYear = oDate.getFullYear(),
//                                 oMonth = oDate.getMonth() + 1,
//                                 oDay = oDate.getDate(),
//                                 oHour = oDate.getHours(),
//                                 oMinutes = oDate.getMinutes(),
//                                 oSeconds = oDate.getSeconds(),
//                                 oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMinutes) + ':' + getzf(oSeconds); //最后拼接时间
//                             return oTime;
//                         }
//                     },
//                 ]
//             ],
//             // page: true,
//             data: diaryall
//         });
//         layer.closeAll('loading');
//     });
// };

// function getzf(num) {
//     if (parseInt(num) < 10) {
//         num = '0' + num;
//     }
//     return num;
// }
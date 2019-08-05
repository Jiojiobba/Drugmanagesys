var token = localStorage.getItem('token');
var username = localStorage.getItem('username');
var drugallinfo; //药品信息数组
var pageSum; //总页码
var pageSize; //每页信息数
var searchcontent; //搜索内容
var searchflag = 0; //是否正在搜索
var dangqianpage; //当前页面
var chachongcontentone;
var chachongcontenttwo; //查重内容
pageSize = 9;

$(function() {
    if (!localStorage.token) {
        alert("登录超时，请重新登录！");
        location.href = "index.html";
    }
    loadpage();
    ajaxgetalldrug(1, pageSize);
});
//增加药品查重
$("#add_drug").on("click", function() {
    // $("#chachong").css("display", "block");
    //捕获页
    var index = layer.open({
        type: 1,
        shade: false,
        title: false, //不显示标题
        content: $('#chachong'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
        cancel: function() {
            $("#chachong").css("display", "none");
            layer.close(index)
        }
    });

    //确认添加查重
    $("#drug_add").on("click", function() {
        chachongcontentone = "";
        chachongcontenttwo = "";
        chachongcontentone = $("input[name = 'yaopinname']").val();
        chachongcontenttwo = $("input[name = 'shangpinname']").val();
        chachongcontentone = $.trim(chachongcontentone); //去除首尾空格
        chachongcontenttwo = $.trim(chachongcontenttwo); //去除首尾空格

        if (chachongcontentone == "") {
            layer.msg("名称不能为空", {
                time: 2000,
            });
        } else {

            $.ajax({
                type: "GET",
                url: "http://106.12.3.28/admin/drug/isExist?genericName=" + chachongcontentone + "&tradeName=" + chachongcontenttwo,
                dataType: "json",
                headers: { 'Content-Type': 'application/json', "username": username, "token": token },
                success: function(data) {
                    if (data.status == 200) {
                        if (data.data.length == 0) {
                            $("input[name = 'yaopinname']").val("");
                            $("input[name = 'shangpinname']").val("");
                            location.href = encodeURI(encodeURI("addDrug.html?one=" + chachongcontentone + "&two=" + chachongcontenttwo));
                        } else {
                            layer.msg("该药品已存在！", {
                                time: 2000,
                            });
                        }
                    } else {
                        layer.msg(data.msg, {
                            time: 2000,
                        });
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown, data) {
                    console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
                    layer.msg("新增药品失败", {
                        time: 2000,
                    });
                },
            });
            $("#chachong").css("display", "none");
            layer.close(index)
        }
    });

    // layer.confirm('是否已经查重药品名称？',
    //     function(index, layero) { //确认
    //         location.href = "addDrug.html";
    //     },
    //     function(index) { //取消
    //         layer.close(index);
    //     });
});


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
    // dd = {
    //     "key": searchcontent
    // }
    $.ajax({
        type: "GET",
        url: "http://106.12.3.28/admin/drugs?" + "&key=" + searchcontent,
        data: JSON.stringify(dd),
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        success: function(data) {
            if (data.status == 200) {
                drugallinfo = data.data.list;
                pageSum = data.data.amount;
                searchcontent = " ";
                getalldrug();
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
    $.ajax({
        type: "GET",
        url: "http://106.12.3.28/admin/drugs?" + "&page=" + 1 + "&pageSize=" + pageSize,
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        success: function(data) {
            if (data.status == 200) {
                drugallinfo = data.data.list;
                pageSum = data.data.amount;
                pagefenye(0);
                getalldrug();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("分页失败！", {
                time: 2000,
            });
        },
    });
};
//获取药品信息ajax请求
function ajaxgetalldrug(page, pagesize, kkey, serachflag) {
    var alldrug;
    dangqianpage = page;
    if (serachflag == 1) {
        $.ajax({
            type: "GET",
            url: "http://106.12.3.28/admin/drugs?" + "&page=" + page + "&pageSize=" + pagesize + "&key=" + kkey,
            dataType: "json",
            headers: { 'Content-Type': 'application/json', "username": username, "token": token },
            // data: JSON.stringify(Getalldrug),
            success: function(data) {
                if (data.status == 200) {
                    drugallinfo = data.data.list;
                    pageSum = data.data.amount;
                    getalldrug();
                    if (page == 1) {
                        pagefenye(1);
                    }
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown, data) {
                console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
                layer.msg("获取药品信息失败！", {
                    time: 2000,
                });
            },
        });
    } else {
        $.ajax({
            type: "GET",
            url: "http://106.12.3.28/admin/drugs?" + "&page=" + page + "&pageSize=" + pagesize,
            dataType: "json",
            headers: { 'Content-Type': 'application/json', "username": username, "token": token },
            success: function(data) {
                if (data.status == 200) {
                    drugallinfo = data.data.list;
                    pageSum = data.data.amount;
                    getalldrug();
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown, data) {
                console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
                layer.msg("获取药品信息失败！", {
                    time: 2000,
                });
            },
        });
    }

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
            limit: pageSize, //每页显示条数
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
            elem: '#drug_table',
            toolbar: false, //工具栏
            title: '药品信息表',
            height: 385,
            limit: pageSize, //每页显示条数
            // page: true,
            totalRow: false,
            loading: true,
            cols: [
                [
                    { field: 'genericName', title: '药品名称' },
                    { field: 'tradeName', title: '商品名称' },
                    { fixed: 'right', title: '操作', toolbar: '#barDemo', width: 130 }
                ],
            ],
            data: drugallinfo,

        });
        layer.closeAll('loading');

        //修改删除工具栏监听
        table.on('tool(drug-table)', function(obj) { //注：tool 是工具条事件名，test 是 table 原始容器的属性 lay-filter="对应的值"
            let temp;
            temp = obj.data.id;
            //删除
            if (obj.event === 'del') {
                layer.confirm('确认删除？',
                    function(index, layero) { //确认
                        deletedrug(temp);
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

function deletedrug(id) {
    $.ajax({
        type: "DELETE",
        url: "http://106.12.3.28/admin/drug?" + "&id=" + id,
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

function getzf(num) {
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
}
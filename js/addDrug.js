var token = localStorage.getItem('token');
var username = localStorage.getItem('username');
var moremenu; //更多菜单的ajax获取数据
var moremenuNum; //更多菜单个数
var drugId; //创建的临时ID
// var drugIdtrue = false;
var audioLink = ""; //音频地址
var videoLink = ""; //视频地址
var picUrl = [];

var createDrugdata = {
    "drugBrief": {
        "id": "",
        "genericName": "",
        "tradeName": "",
        "specifications": "",
        "dosageAndAdministration": "",
        "indications": "",
        "adverseReactions": "",
        "contraindications": "",
        "precautions": "",
        "storage": "",
        "videoUrl": "",
        "audioUrl": "",
        "enterprise": "",
        "redundancy": "",
    },
    "drugMore": []
};
var drugBrief = {
    "id": "",
    "genericName": "",
    "tradeName": "",
    "specifications": "",
    "dosageAndAdministration": "",
    "indications": "",
    "adverseReactions": "",
    "contraindications": "",
    "precautions": "",
    "storage": "",
    "videoUrl": "",
    "audioUrl": "",
    "enterprise": "",
    "redundancy": "",
};

function logintrue() {
    if (!localStorage.token) {
        layer.msg("登录超时，请重新登录！", {
            time: 2000,
        });
        location.href = "login.html";
    }
}

$(function() {
    logintrue();
    getmoremenu();
    grtID();

    //获取上个页面跳转来的药品名称和商品名
    var h1 = decodeURI(getUrlParam('one'));
    var h2 = decodeURI(getUrlParam('two'));

    $("input[name = 'mingcheng']").val(h1)
    $("input[name = 'shangpinname']").val(h2);

    createDrugdata.drugBrief.id = drugId;
    createDrugdata.drugBrief.genericName = $("input[name='mingcheng']").val(); //药品名称
    createDrugdata.drugBrief.tradeName = $("input[name='shangpinname']").val(); //商品名
    loadcreat();

});

function loadcreat() {
    $.ajax({
        type: "POST",
        url: "http://106.12.3.28/admin/drug",
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        data: JSON.stringify(createDrugdata),
        success: function(data) {
            if (data.status == 200) {}
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("新增药品出错", {
                time: 2000,
            });
        },
    });
}
//保存按钮
function yesonefunc() {
    createDrugdata.drugBrief.id = drugId;
    createDrugdata.drugBrief.genericName = $("input[name='mingcheng']").val(); //药品名称
    createDrugdata.drugBrief.tradeName = $("input[name='shangpinname']").val(); //商品名
    createDrugdata.drugBrief.specifications = $("textarea[name='guige']").val(); //药品规格
    createDrugdata.drugBrief.dosageAndAdministration = $("textarea[name='yongfa']").val(); //用法用量
    createDrugdata.drugBrief.indications = $("textarea[name='shiying']").val(); //适应症
    createDrugdata.drugBrief.adverseReactions = $("textarea[name='buliang']").val(); //不良反应
    createDrugdata.drugBrief.contraindications = $("textarea[name='jinji']").val(); //禁忌症
    createDrugdata.drugBrief.precautions = $("textarea[name='zhuyi']").val(); //注意事项
    createDrugdata.drugBrief.storage = $("textarea[name='zhucang']").val(); //贮藏方式
    createDrugdata.drugBrief.audioUrl = audioLink;
    createDrugdata.drugBrief.videoUrl = videoLink;
    createDrugdata.drugBrief.enterprise = $("textarea[name='qiye']").val(); //生产企业
    // createDrugdata.drugBrief.redundancy = ""; //冗余字段
    //更多菜单的内容获取
    var inputt = document.getElementsByTagName("moremenu1");
    createDrugdata.drugMore.splice(0, createDrugdata.drugMore.length);
    for (var i = 0; i < moremenuNum; i++) {
        var infoo;
        var namee = "textarea[name=" + "'moremenu" + i + "']";
        infoo = $(namee).val();
        var moremenudata = {
            "name": moremenu[i],
            "content": infoo,
        }
        createDrugdata.drugMore.push(moremenudata);
    }
    createDrug();
};

//确认按钮
// $("#addDrug_yes").click("on", function() {

// });
//创建完清空
function clearr() {
    createDrugdata = {
        "drugBrief": {
            "id": "",
            "genericName": "",
            "tradeName": "",
            "specifications": "",
            "dosageAndAdministration": "",
            "indications": "",
            "adverseReactions": "",
            "contraindications": "",
            "precautions": "",
            "storage": "",
            "videoUrl": "",
            "audioUrl": "",
            "enterprise": "",
            "redundancy": "",
        },
        "drugMore": []
    };
    grtID();
    $("input[name='mingcheng']").val(""); //药品名称
    //$("input[name='shangpin']").val(""); //商品名
    $("textarea[name='guige']").val(""); //药品规格
    $("textarea[name='yongfa']").val(""); //用法用量
    $("textarea[name='shiying']").val(""); //适应症
    $("textarea[name='buliang']").val(""); //不良反应
    $("textarea[name='jinji']").val(""); //禁忌症
    $("textarea[name='zhuyi']").val(""); //注意事项
    $("textarea[name='zhucang']").val(""); //贮藏方式
    $("textarea[name='qiye']").val(""); //生产企业
    // createDrugdata.drugBrief.redundancy = ""; //冗余字段

    //更多菜单的内容清空
    for (var i = 0; i < moremenuNum; i++) {
        var namee = "textarea[name=" + "'moremenu" + i + "']";
        $(namee).val("");
    }
}
//创建药品
function createDrug() {
    $.ajax({
        type: "POST",
        url: "http://106.12.3.28/admin/drug",
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        data: JSON.stringify(createDrugdata),
        success: function(data) {
            if (data.status == 200) {
                // drugIdtrue = true;
                layer.msg("保存成功！", {
                    time: 2000,
                });
                // clearr();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("保存失败！", {
                time: 2000,
            });
        },
    });
};


var ipic = 0;
//点击上传图片按钮
$("#uploadppic").click("on", function() {
    upPicPl();
});

function getUrlParam(name) {
    //构造一个含有目标参数的正则表达式对象
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) {
        return unescape(r[2]);
    } else {
        return null; //返回参数值
    }
};

//批量关联图片
function upPicPl() {
    var plpic = {
        "drugId": drugId,
        "urlList": []
    };
    // if (drugIdtrue == true) {
    if (picUrl.length > 0) {
        for (var i = 0; i < picUrl.length; i++) {
            if (picUrl[i].up == true) {
                plpic.urlList.push(picUrl[i].url);
            }
        };
        $.ajax({
            type: "POST",
            url: "http://106.12.3.28/admin/drug/picture",
            dataType: "json",
            headers: { 'Content-Type': 'application/json', "username": username, "token": token },
            data: JSON.stringify(plpic),
            success: function(data) {
                if (data.status == 200) {
                    layer.msg("上传成功！", {
                        time: 2000,
                    });
                    clearallPic();
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown, data) {
                console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
                layer.msg("上传所有图片失败！", {
                    time: 2000,
                });
            },
        });
    } else {
        layer.msg("请选择图片！", {
            time: 2000,
        });
    }
    // } else {
    //     layer.msg("请先新建药品，再上传图片！", {
    //         time: 2000,
    //     });
    // }


};
//清空所有预览图
function clearallPic() {
    for (var i = 0; i < ipic; i++) {
        var showidd = "#show" + i;
        var closeidd = "#close" + i;
        if (picUrl[i].up == true) {
            $(showidd).remove();
            $(closeidd).remove();
        }

    };
    picUrl = [];
    ipic = 0;
};
//删除图片
function deletepic(obj) {
    var idd = obj.slice(5);
    var deleteid = parseInt(idd)


    var showidd = "#show" + idd;
    var closeidd = "#close" + idd;


    for (var i = 0; i < picUrl.length; i++) {
        if (picUrl[i].id == deleteid) {
            picUrl[i].up = false;
        }
    };

    $(showidd).remove();
    $(closeidd).remove();
    // document.getElementById(showidd).style.display = "none"; //将图片设置为可见
    // document.getElementById(closeidd).style.display = "none"; //将图片设置为可见

}
//上传图片
function uploadPicture() {
    var formData = new FormData($('#uploadFormpic')[0]);
    var bbpic = formData.get("picture"); // 获取key为name的第一个值
    var picLink = "";
    var dd;
    if (bbpic.size != 0) {
        $.ajax({
            type: 'post',
            url: "http://106.12.3.28/admin/drug/uploadPicture?" + "drugId=" + drugId,
            //上传文件的请求路径必须是绝对路劲
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            accept: "picture",
            headers: { "username": username, "token": token },
            success: function(responseStr) {
                picLink = "http://106.12.3.28" + responseStr.data;
                var picuurl = {
                    "id": ipic,
                    "url": picLink,
                    "up": true
                }
                picUrl.push(picuurl);
                ipic++;
                return picLink;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown, data) {
                console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
                layer.msg("图片上传失败", {
                    time: 2000,
                });
            }
        });
    } else layer.msg("请选择图片！", {
        time: 2000,
    });
};
//添加图片预览图
function changepic(obj) {
    //首先插入一个图片标签，src属性为空，宽高设置为100px，暂时设为不可见
    // console.log(ipic);
    // var newsrc = uploadPicture();
    // console.log(obj.files[0]);
    var newsrc = getObjectURL(obj.files[0]);
    document.getElementById("img_span").innerHTML += "<img src=\"\" class=\"immage2\" id=\"show" + ipic + "\" width=\"200\" style=\"opacity: 0;\">" +
        // "<use class=\"icon-close\" id=\"close" + ipic + "\" onclick=\"deletepic(this.id)\"></use>";
        "<img class=\"icon-close2\"  src=\"http://106.12.3.28:10006/images/close.svg\"  id=\"close" + ipic + "\" onclick=\"deletepic(this.id)\">";

    //调用getObjectURL函数，返回上传的图片的地址
    document.getElementById('show' + ipic).src = newsrc; //将图片的路径设置为返回上传的图片的地址
    document.getElementById("show" + ipic).style.opacity = 1; //将图片设置为可见
    uploadPicture();
    // ipic++;
}
//建立一个可存取到该file的url
function getObjectURL(file) {
    var url = null;
    // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}
//取消按钮
function canceljump() {
    location.href = "drugManage.html";
}

//上传视频
$("#uploadvideo").click(function() {
    var index = layui.layer.load(1);
    var formData = new FormData($('#uploadFormV')[0]);
    var bbvidio = formData.get("video"); // 获取key为name的第一个值
    if (bbvidio.size != 0) {
        $.ajax({
            type: 'post',
            url: "http://106.12.3.28/admin/drug/uploadVideo?" + "drugId=" + drugId,
            //上传文件的请求路径必须是绝对路劲
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            accept: "video",
            headers: { "username": username, "token": token },
            success: function(responseStr) {
                videoLink = "http://106.12.3.28" + responseStr.data;
                layer.close(index);
                layer.msg("上传视频成功", {
                    time: 2000,
                });

            },
            error: function(XMLHttpRequest, textStatus, errorThrown, data) {
                console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
                layer.close(index)
                layer.msg("上传视频失败", {
                    time: 2000,
                });
            }
        });
    } else {
        layer.close(index);
        layer.msg("请选择视频！", {
            time: 2000,
        });
    }
});

//上传音频
$("#uploadaudio").click(function() {
    var index = layui.layer.load(1);
    var formData = new FormData($('#uploadFormA')[0]);
    var bbaudio = formData.get("audio"); // 获取key为name的第一个值
    if (bbaudio.size != 0) {
        $.ajax({
            type: 'post',
            url: "http://106.12.3.28/admin/drug/uploadAudio?" + "drugId=" + drugId,
            //上传文件的请求路径必须是绝对路劲
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            accept: "audio",
            headers: { "username": username, "token": token },
            success: function(responseStr) {
                audioLink = "http://106.12.3.28" + responseStr.data;
                layer.close(index) //加载完数据
                layer.msg("上传音频成功", {
                    time: 2000,
                });
            },
            error: function(XMLHttpRequest, textStatus, errorThrown, data) {
                console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
                layer.close(index)
                layer.msg("上传音频失败", {
                    time: 2000,
                });
            }
        });
    } else {
        layer.close(index)
        layer.msg("请选择音频", {
            time: 2000,
        });
    }
});
//创建id
function grtID() {
    $.ajax({
        type: "GET",
        url: "http://106.12.3.28/admin/drug/nextId",
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        success: function(data) {
            if (data.status == 200) {
                drugId = data.data;
                // console.log("ID" + drugId)
            } else drugId = NULL;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("获取药品ID失败", {
                time: 2000,
            });
        },
    });
}
//获取更多菜单标题
function getmoremenu() {
    $.ajax({
        type: "GET",
        url: "http://106.12.3.28/admin/moreMenus",
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        // data: JSON.stringify(Getalldrug),
        success: function(data) {
            if (data.status == 200) {
                moremenu = data.data;
                moremenuNum = moremenu.length;
                for (var i = 0; i < moremenu.length; i++) {
                    $('#submitall').before("<div class=\"kuang2\"><div class=\"kuang2-title\">" + moremenu[i] +
                        ": </div> <textarea name=\"moremenu" + i + "\" class=\"layui-input input-in-text input-in \" placeholder=\"" +
                        moremenu[i] + "内容\"></textarea></div>");
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("获取更多菜单失败！", {
                time: 2000,
            });
        },
    });
}
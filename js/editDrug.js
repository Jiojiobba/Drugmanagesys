let drugId = "";
var token = localStorage.getItem('token');
var username = localStorage.getItem('username');
var moremenu; //更多菜单的ajax获取数据
var moremenuNum; //更多菜单个数
var thisDrug;
var audioLink = ""; //音频地址
var videoLink = ""; //视频地址
var picUrl = []; //原有图片数组
// layui.use(['laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider'], function() {
//     var laydate = layui.laydate, //日期
//         laypage = layui.laypage, //分页
//         layer = layui.layer, //弹层
//         table = layui.table, //表格
//         upload = layui.upload, //上传
//         element = layui.element; //元素操作
//     var loadd = layui.layer.load(1); //添加laoding,0-2两种方式
// });

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
window.onload = function() {
    let thisURL = document.URL;
    if (!localStorage.token) {
        alert("登录超时，请重新登录！");
        location.href = "login.html";
    }
    drugId = thisURL.split('?')[1];
    drugId = drugId.toString();
    // this.console.log(thisURL);
    // this.console.log(drugId);
    getmoremenu();
    getDrugInfo();
    getallPic();
};
//取消按钮
$("#addDrug_cancel").click("on", function() {
    location.href = "drugManage.html";
});
//点击修改视频
$("#uploadvideo").on("click", function() {
    layer.confirm('确认修改原有视频？',
        function(index, layero) { //确认
            uploadvedio();
            layer.close(index);
        },
        function(index) { //取消
            layer.close(index);
        });
});
//点击修改音频
$("#uploadaudio").on("click", function() {
    layer.confirm('确认修改原有音频？',
        function(index, layero) { //确认
            uploadaudio();
            layer.close(index);
        },
        function(index) { //取消
            layer.close(index);
        });
});
//删除视频
$("#deletevedio").on("click", function() {
    layer.confirm('确认删除原有视频？',
        function(index, layero) { //确认
            deletevedio();
            layer.close(index);
        },
        function(index) { //取消
            layer.close(index);
        });
});
//删除音频
$("#deleteaudio").on("click", function() {
    layer.confirm('确认删除原有视频？',
        function(index, layero) { //确认
            deleteaudio();
            layer.close(index);
        },
        function(index) { //取消
            layer.close(index);
        });
});

function yessave() {
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
//取消按钮
function canceljump() {
    location.href = "drugManage.html";
}

var ipic = 0;
//查询药品图片集
function getallPic() {
    $.ajax({
        type: "GET",
        url: "http://106.12.3.28/admin/drug/picture?drugId=" + drugId,
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        success: function(data) {
            if (data.status == 200) {
                var picdata = data.data
                displayPic(picdata)
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("加载药品原有图片失败！", {
                time: 2000,
            });
        },
    });
};
//展示原有图片
function displayPic(picdata) {
    for (var i = 0; i < picdata.length; i++) {
        var newsrc = picdata[i].pictureUrl;
        document.getElementById("img_span").innerHTML += "<img src=\"\"  class=\"immage2\" id=\"show" + ipic + "\" width=\"200\" style=\"opacity: 0;\">" +
            // "<use class=\"icon-close\" id=\"close" + ipic + "\" onclick=\"deletepic(this.id)\"></use>";
            "<img class=\"icon-close2\" src=\"http://106.12.3.28:10006/images/close.svg\" id=\"close" + ipic + "\" onclick=\"deletepic(this.id)\">";

        document.getElementById('show' + ipic).src = newsrc; //将图片的路径设置为返回上传的图片的地址
        document.getElementById("show" + ipic).style.opacity = 1; //将图片设置为可见
        // picLink = "http://106.12.3.28" + picdata[i].pictureUrl;
        var picLink = picdata[i].pictureUrl;
        var pictureId = picdata[i].pictureId;
        var picuurl = {
                "id": ipic,
                "picid": pictureId,
                "url": picLink,
                "up": 0
            } //0原有的图片，1要上传的图片，2删除的图片
        picUrl.push(picuurl);
        ipic++;
    }
};

//图片预览图
function changepic(obj) {
    //首先插入一个图片标签，src属性为空，宽高设置为100px，暂时设为不可见
    // console.log(ipic);
    // var newsrc = uploadPicture();
    // console.log(obj.files[0]);
    var newsrc = getObjectURL(obj.files[0]);
    document.getElementById("img_span").innerHTML += "<img src=\"\"  class=\"immage2\" id=\"show" + ipic + "\" width=\"200\" style=\"opacity: 0;\">" +
        // "<use class=\"icon-close\" id=\"close" + ipic + "\" onclick=\"deletepic(this.id)\"></use>";
        "<img class=\"icon-close2\"  src=\"http://106.12.3.28:10006/images/close.svg\"  id=\"close" + ipic + "\" onclick=\"deletepic(this.id)\">";

    //调用getObjectURL函数，返回上传的图片的地址
    document.getElementById('show' + ipic).src = newsrc; //将图片的路径设置为返回上传的图片的地址
    document.getElementById("show" + ipic).style.opacity = 1; //将图片设置为可见
    uploadPicture();
    // ipic++;
}

//点击上传图片按钮
$("#uploadppic").click("on", function() {
    layer.confirm('确认上传以下图片？',
        function(index, layero) { //确认
            layer.close(index);
            upPicPl();
        },
        function(index) { //取消
            layer.close(index);
        });
});
//批量关联图片+删除图片
function upPicPl() {
    var plpic = {
        "drugId": drugId,
        "addedUrlList": [],
        "deletedIdList": []
    };
    if (picUrl.length > 0) {
        for (var i = 0; i < picUrl.length; i++) {
            if (picUrl[i].up == 1) {
                plpic.addedUrlList.push(picUrl[i].url);
            } else if (picUrl[i].up == 2) {
                plpic.deletedIdList.push(picUrl[i].picid);
            }
        };
        $.ajax({
            type: "POST",
            url: "http://106.12.3.28/admin/drug/updatePictures",
            dataType: "json",
            headers: { 'Content-Type': 'application/json', "username": username, "token": token },
            data: JSON.stringify(plpic),
            success: function(data) {
                if (data.status == 200) {
                    layer.msg("修改成功！", {
                        time: 2000,
                    });
                    clearallPic();
                } else {
                    layer.msg(data.msg, {
                        time: 2000,
                    });
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



};
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
//清空所有预览图
function clearallPic() {
    for (var i = 0; i < ipic; i++) {
        var showidd = "#show" + i;
        var closeidd = "#close" + i;
        // if (picUrl[i].up == true) {
        $(showidd).remove();
        $(closeidd).remove();
        // }

    };
    picUrl = [];
    ipic = 0;
    getallPic();
};
//删除图片
function deletepic(obj) {
    layer.confirm('确认删除该图片？',
        function(index, layero) { //确认
            layer.close(index);
            var idd = obj.slice(5);
            var deleteid = parseInt(idd)

            var showidd = "#show" + idd;
            var closeidd = "#close" + idd;

            for (var i = 0; i < picUrl.length; i++) {
                if (picUrl[i].id == deleteid && picUrl[i].up == 0) {
                    picUrl[i].up = 2;
                } else if (picUrl[i].id == deleteid && picUrl[i].up == 1) {
                    picUrl.splice(i, 1)
                }
            };

            $(showidd).remove();
            $(closeidd).remove();
        },
        function(index) { //取消
            layer.close(index);
        });


}
//上传图片
function uploadPicture() {
    var formData = new FormData($('#uploadFormpic')[0]);
    var bbpic = formData.get("picture"); // 获取key为name的第一个值
    var picLink = "";
    var dd;
    // console.log(bbpic);
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
                    "pictureId": "",
                    "url": picLink,
                    "up": 1
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
//修改药品信息
function createDrug() {
    $.ajax({
        type: "POST",
        url: "http://106.12.3.28/admin/drug",
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        data: JSON.stringify(createDrugdata),
        success: function(data) {
            if (data.status == 200) {
                layer.msg("修改成功！", {
                    time: 2000,
                });
                // clearr();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("修改失败！", {
                time: 2000,
            });
        },
    });

}
//修改药品视频
function editvedio(newvediourl) {
    var index = layui.layer.load(1);
    var edvedio = {
        "id": drugId,
        "videoUrl": newvediourl
    }
    JSON.stringify(edvedio);
    $.ajax({
        type: 'post',
        url: "http://106.12.3.28/admin/drug/video",
        data: JSON.stringify(edvedio),
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        success: function(responseStr) {
            layer.close(index);
            layer.msg("修改视频成功", {
                time: 2000,
            });
            $("#vedioold").attr('src', edvedio.videoUrl);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.close(index);
            layer.msg("修改视频失败", {
                time: 2000,
            });
        }
    });
};

//上传药品视频
function uploadvedio() {
    var formData = new FormData($('#uploadFormV')[0]);
    var bbvidio = formData.get("video"); // 获取key为name的第一个值
    // console.log(bbvidio)
    var index = layui.layer.load(1);
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
                var vedioLink = "http://106.12.3.28" + responseStr.data;
                layer.close(index);
                editvedio(vedioLink);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown, data) {
                console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
                layer.close(index);
                layer.msg("上传失败", {
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


};

//修改药品音频
function editaudio(newaudiourl) {
    var index = layui.layer.load(1);
    var edaudio = {
            "id": drugId,
            "audioUrl": newaudiourl
        }
        // $("#audioold").attr('src', "http://106.12.3.28/static/audio/1/who.mp3");//测试
    $.ajax({
        type: 'post',
        url: "http://106.12.3.28/admin/drug/audio",
        data: JSON.stringify(edaudio),
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        success: function(responseStr) {
            layer.close(index);
            $("#audioold").attr('src', edaudio.audioUrl);
            layer.msg("修改音频成功", {
                time: 2000,
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.close(index);
            layer.msg("修改音频失败", {
                time: 2000,
            });
        }
    });
};

//上传药品音频
function uploadaudio() {
    var index = layui.layer.load(1);
    var formData = new FormData($('#uploadFormA')[0]);
    var bbvidio = formData.get("audio"); // 获取key为name的第一个值
    if (bbvidio.size != 0) {
        $.ajax({
            type: 'post',
            url: "http://106.12.3.28/admin/drug/uploadAudio?" + "drugId=" + drugId,
            //上传文件的请求路径必须是绝对路劲
            data: formData,
            cache: false,
            processData: false,
            contentType: false,
            accept: "video",
            headers: { "username": username, "token": token },
            success: function(responseStr) {
                var audioLink = "http://106.12.3.28" + responseStr.data;
                editaudio(audioLink);
                layer.close(index);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown, data) {
                console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
                layer.close(index);
                layer.msg("上传失败", {
                    time: 2000,
                });
            }
        });
    } else {
        layer.close(index);
        layer.msg("请选择音频！", {
            time: 2000,
        });
    }

};

//查询药品音频
function getaudio() {
    $.ajax({
        type: "GET",
        url: "http://106.12.3.28/admin/drug/audio?id=" + drugId,
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        // data: JSON.stringify(Getalldrug),
        success: function(data) {
            if (data.status == 200) {
                if (data.data == "none") {
                    $("#audioold").attr('src', "");
                } else {
                    var audioo = data.data;
                    $("#audioold").attr('src', audioo);
                }
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("获取原有音频失败！", {
                time: 2000,
            });
        },
    });
};
//查询药品视频
function getvedio() {
    $.ajax({
        type: "GET",
        url: "http://106.12.3.28/admin/drug/video?id=" + drugId,
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        // data: JSON.stringify(Getalldrug),
        success: function(data) {
            if (data.status == 200) {
                var vedioo = data.data;
                $("#vedioold").attr('src', vedioo);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("获取原有视频失败！", {
                time: 2000,
            });
        },
    });
};
//删除药品音频
function deleteaudio() {
    $.ajax({
        type: 'DELETE',
        url: "http://106.12.3.28/admin/drug/audio?id=" + drugId,
        headers: { "username": username, "token": token },
        success: function(responseStr) {
            layer.msg("删除音频成功！", {
                time: 2000,
            });
            $("#audioold").attr('src', "");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("删除音频失败！", {
                time: 2000,
            });
        }
    });
};
//删除药品视频
function deletevedio() {

    $.ajax({
        type: 'DELETE',
        url: "http://106.12.3.28/admin/drug/video?id=" + drugId,
        headers: { "username": username, "token": token },
        success: function(responseStr) {
            layer.msg("删除视频成功！", {
                time: 2000,
            });
            $("#vedioold").attr('src', "");
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.msg("删除视频失败！", {
                time: 2000,
            });
        }
    });
};
//获取药品信息
function getDrugInfo() {
    var index = layui.layer.load(1);
    $.ajax({
        type: "GET",
        url: "http://106.12.3.28/admin/drug?id=" + drugId,
        dataType: "json",
        headers: { 'Content-Type': 'application/json', "username": username, "token": token },
        // data: JSON.stringify(xx),
        success: function(data) {
            if (data.status == 200) {
                thisDrug = data.data;
                fullfill(thisDrug);
                // getaudio();
                // getvedio();
                layer.close(index);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown, data) {
            console.log(XMLHttpRequest.status, XMLHttpRequest.readyState, textStatus);
            layer.close(index);

            layer.msg("无法获取药品信息！", {
                time: 2000,
            });
            location.href = "drugManage.html";
        },
    });
};
//回填药品信息
function fullfill(data) {
    var drugBrief = data.drugBrief;
    var drugMore = data.drugMore;
    var pictures = data.pictures;
    //简单信息回填
    $("input[name='mingcheng']").val(drugBrief.genericName); //
    $("input[name='shangpinname']").val(drugBrief.tradeName); //
    $("textarea[name='guige']").val(drugBrief.specifications); //
    $("textarea[name='shiying']").val(drugBrief.indications); //
    $("textarea[name='buliang']").val(drugBrief.adverseReactions); //
    $("textarea[name='jinji']").val(drugBrief.contraindications); //
    $("textarea[name='zhuyi']").val(drugBrief.precautions); //
    $("textarea[name='zhucang']").val(drugBrief.storage); //
    $("textarea[name='yongfa']").val(drugBrief.dosageAndAdministration); //

    //更多菜单信息回填
    var drugMorelength = drugMore.length;
    for (var i = 0; i < drugMorelength; i++) {
        $('#submitall').before("<div class=\"kuang2\"><div class=\"kuang2-title\">" + drugMore[i].name +
            ": </div> <textarea name=\"moremenu" + i + "\" class=\"layui-input input-in-text input-in \" placeholder=\"" +
            drugMore[i].name + "内容\"></textarea></div>");
        var moretem = "textarea[name='moremenu" + i + "']";
        $(moretem).val(drugMore[i].content);

    }

    //视频音频回填
    var audioo = drugBrief.audioUrl;
    var vedioo = drugBrief.videoUrl;

    $("#audioold").attr('src', audioo);
    $("#vedioold").attr('src', vedioo);

};

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
/**
 * Created by 郭欣光 on 2018/4/7.
 */


var isGetNodeNumberEachGroup = true;
var batchDownloadImageServerIp = null;
var batchDownloadImageToHosts = null;
var downloadEnvironmentServerIp = null;
var downloadEnvironmentToHosts = null;
var clearEnvironmentToHosts = null;
function getNodeInformation() {
    $.ajax({
        url: "/get_all_experimental_node",
        type: "POST",
        cache: false,//设置不缓存
        success: getNodeInformationSuccess,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status >= 400 && XMLHttpRequest.status < 500) {
                alert("客户端请求出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
            } else {
                if (XMLHttpRequest.status >= 500 || XMLHttpRequest.status <= 600) {
                    alert("服务器出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                } else {
                    if (XMLHttpRequest.status >= 300 || XMLHttpRequest.status < 400) {
                        alert("重定向问题！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                    } else {
                        alert("抱歉，系统好像出现一些异常！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                    }
                }
            }
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

function getNodeInformationSuccess(data) {
    if (data.indexOf("暂无实验节点！") == 0) {
        document.getElementById("nodeInformation").innerHTML = "<h2 align=\"center\">" + data + "</h2>";
    } else {
        var nodeNumberEachGroupInputIsFocus = false;
        try {
            nodeNumberEachGroupInputIsFocus = $("#node-number-each-group").is(":focus");
        } catch (err) {
            console.log(err);
        }
        var nodeCheckBox = null;
        try {
            nodeCheckBox = document.getElementsByClassName("node-check-box");
        } catch (err) {
            console.log(err);
        }
        var checkNodeArray = null;
        if (nodeCheckBox != null) {
            checkNodeArray = new Array();
            var n = 0;
            for (var i = 0; i < nodeCheckBox.length; i++) {
                if (nodeCheckBox[i].checked) {
                    checkNodeArray[n] = nodeCheckBox[i].value;
                    n++;
                }
            }
        }
        var nodeNumberEachGroup = "";
        try {
            nodeNumberEachGroup = $("#node-number-each-group").val();
        } catch (err) {
            console.log(err);
        }
        var obj = JSON.parse(data);
        var experimentalNodeList = obj['experimentalNodeList'];
        var str = "";
        str += '<div class="pull-left">';
        str += '<button type="button" class="btn btn-success" onclick="batchDownload();">批量下载</button>';
        str += '&nbsp;&nbsp;&nbsp;&nbsp;';
        str += '<button type="button" class="btn btn-danger" onclick="deleteAll();">一键删除</button>';
        str += '</div>';
        str += '<div class="pull-right">';
        str += '<form class="form-horizontal">';
        str += '<div class="form-group">';
        str += '<div class="col-sm-3"></div>';
        str += '<label for="node-number-each-group" class="col-sm-4 control-label">每组节点个数：</label>';
        str += '<div class="col-sm-2"><input type="text" class="form-control" id="node-number-each-group"></div>';
        str += '<div class="col-sm-2"><button type="button" class="btn btn-success" onclick="changeNodeGroup();">确认</button></div>';
        str += '</div>';
        str += '</form>';
        str += '</div>';
        str += '<div class="clearfix"></div>';
        str += '<br/>';
        str += "<table class=\"table table-striped\">";
        str += "<tr>";
        str += "<td class=\"danger\" align=\"center\"><b><button type=\"button\" class=\"btn btn-link\" onclick=\"selectAllNode();\">全选</button></b></td>";
        str += "<td class=\"active\" align=\"center\"><b>节点IP</b></td>";
        str += "<td class=\"warning\" align=\"center\"><b>分组</b></td>";
        str += "<td class=\"success\" align=\"center\"><b>使用时间</b></td>";
        str += "<td class=\"warning\" align=\"center\"><b>使用IP</b></td>";
        str += "<td class=\"danger\" align=\"center\"><b>状态</b></td>";
        str += "<td class=\"active\" align=\"center\"><b>操作</b></td>";
        str += "</tr>";
        for (var i = 0; i < experimentalNodeList.length; i++) {
            var experimentalNode = experimentalNodeList[i];
            str += "<tr>";
            if (checkNodeArray != null) {
                if (isInArray(checkNodeArray, experimentalNode.ip)) {
                    str += "<td class=\"danger\" align=\"center\"><b><input type=\"checkbox\" class=\"node-check-box\" id=\"node-ip-" + experimentalNode.ip + "\" value=\"" + experimentalNode.ip + "\" checked></td>";
                } else {
                    str += "<td class=\"danger\" align=\"center\"><b><input type=\"checkbox\" class=\"node-check-box\" id=\"node-ip-" + experimentalNode.ip + "\" value=\"" + experimentalNode.ip + "\"></td>";
                }
            } else {
                str += "<td class=\"danger\" align=\"center\"><b><input type=\"checkbox\" class=\"node-check-box\" id=\"node-ip-" + experimentalNode.ip + "\" value=\"" + experimentalNode.ip + "\"></td>";
            }
            str += "<td class=\"active\" align=\"center\">" + experimentalNode.ip + "</td>";
            str += "<td class=\"warning\" align=\"center\">" + experimentalNode.groupNumber + "</td>";
            if (experimentalNode.datetime == undefined || experimentalNode.datetime == null) {
                str += "<td class=\"success\" align=\"center\">无</td>";
            } else {
                str += "<td class=\"success\" align=\"center\">" + experimentalNode.datetime.split(".")[0] + "</td>";
            }
            if (experimentalNode.userId == undefined || experimentalNode.userId == null) {
                str += "<td class=\"warning\" align=\"center\">无</td>";
            } else {
                str += "<td class=\"warning\" align=\"center\">" + experimentalNode.userId + "</td>";
            }
            if (experimentalNode.status.indexOf("正常") == 0) {
                str += "<td class=\"danger\" align=\"center\"><span style=\"color: green\">" + experimentalNode.status + "</span></td>";
            } else {
                str += "<td class=\"danger\" align=\"center\"><span style=\"color: red\">" + experimentalNode.status + "</span></td>"
            }
            str += "<td class=\"active\" align=\"center\">\n";
            if (experimentalNode.status.indexOf("正常") == 0) {
                str += "<button type=\"button\" class=\"btn btn-warning\" onclick=\"changeNodeStatus('" + experimentalNode.ip + "', '错误')\">错误</button>\n";
            } else {
                str += "<button type=\"button\" class=\"btn btn-success\" onclick=\"changeNodeStatus('" + experimentalNode.ip + "', '正常')\">正常</button>\n";
            }
            str += '&nbsp;&nbsp;';
            str += "<button type=\"button\" class=\"btn btn-primary\" onclick=\"downloadEnvironment('" + experimentalNode.ip + "');\">下载环境</button>";
            str += '&nbsp;&nbsp;';
            str += "<button type=\"button\" class=\"btn btn-danger\" onclick=\"clearEnvironment('" + experimentalNode.ip + "')\">清除环境</button>";
            // str += "<button type=\"button\" class=\"btn btn-danger\">删除</button>\n";
            str += "</td>";
            str += "</tr>";
        }
        str += "</table>";
        document.getElementById("nodeInformation").innerHTML = str;
        if (nodeNumberEachGroupInputIsFocus) {
            $("#node-number-each-group").focus();
        }
        $("#node-number-each-group").val(nodeNumberEachGroup);
        if (isGetNodeNumberEachGroup) {
            getNodeNumberEachGroup();
        }
    }
}

function changeNodeStatus(ip, status) {
    var yes = false;
    if (status == "正常") {
        yes = confirm("确定设置为正常？如果该节点服务没有正常启动，则仍无法使用，请您确保该实验节点服务已经正常，或该节点已经重启！");
    } else {
        if (status == "错误") {
            yes = confirm("确定设为错误？设为错误后该节点将不能作为实验节点使用！");
        } else {
            yes = false;
        }
    }
    if (yes) {
        var obj = new Object();
        obj.ip = ip;
        obj.status = status;
        $.ajax({
            url: "/change_node_status",
            type: "POST",
            cache: false,//设置不缓存
            data: obj,
            success: changeNodeStatusSuccess,
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status >= 400 && XMLHttpRequest.status < 500) {
                    alert("客户端请求出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                } else {
                    if (XMLHttpRequest.status >= 500 || XMLHttpRequest.status <= 600) {
                        alert("服务器出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                    } else {
                        if (XMLHttpRequest.status >= 300 || XMLHttpRequest.status < 400) {
                            alert("重定向问题！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                        } else {
                            alert("抱歉，系统好像出现一些异常！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                        }
                    }
                }
                // alert(XMLHttpRequest.status);
                // alert(XMLHttpRequest.readyState);
                // alert(textStatus);
            }
        });
    }
}

function changeNodeStatusSuccess(data) {
    if (data.indexOf("ok") == 0) {
        alert("设置成功！");
        window.location.reload();
    } else {
        if (data.indexOf("没有用户！") == 0) {
            window.location.href = "/index.html";
        } else {
            if (data.indexOf("抱歉，您的身份是") == 0) {
                alert(data);
                window.location.href = "/index.html";
            } else {
                alert(data);
            }
        }
    }
}

function isInArray(arr,value){
    for(var i = 0; i < arr.length; i++){
        if(value === arr[i]){
            return true;
        }
    }
    return false;
}

function selectAllNode() {
    var nodeCheckBox = null;
    try {
        nodeCheckBox = document.getElementsByClassName("node-check-box");
    } catch (err) {
        console.log(err);
    }
    if (nodeCheckBox == null) {
        alert("没有可选择节点！");
    } else {
        var isSelectAllNode = false;
        for (var i = 0; i < nodeCheckBox.length; i++) {
            var node = nodeCheckBox[i];
            if (!node.checked) {
                isSelectAllNode = true;
                node.click();
            }
        }
        if (!isSelectAllNode) {
            for (var i = 0; i < nodeCheckBox.length; i++) {
                var node = nodeCheckBox[i];
                node.click();
            }
        }
    }
}

function batchDownload() {
    batchDownloadImageToHosts = null;
    var nodeCheckBox = null;
    try {
        nodeCheckBox = document.getElementsByClassName("node-check-box");
    } catch (err) {
        console.log(err);
    }
    if (nodeCheckBox == null) {
        alert("没有可选择节点！");
    } else {
        var nodeList = new Array();
        var isSelectNode = false;
        var n = 0;
        for (var i = 0; i < nodeCheckBox.length; i++) {
            var node = nodeCheckBox[i];
            if (node.checked) {
                isSelectNode = true;
                nodeList[n] = node.value;
                n++;
            }
        }
        if (isSelectNode) {
            batchDownloadImageToHosts = nodeList;
            $.ajax({
                url: dockerInformationUrl + "node/alive_server_list/",
                type: "POST",
                cache: false,//设置不缓存
                success: function (data) {
                    var resultJsonObject = JSON.parse(data);
                    if (resultJsonObject["statusCode"] >= 2) {
                        alert(resultJsonObject["errMessage"]);
                    } else {
                        var aliveServerList = resultJsonObject["message"];
                        if (aliveServerList.length == 0) {
                            alert("没有可用镜像服务器！");
                            batchDownloadImageServerIp = null;
                        } else {
                            var requestData = new Object();
                            requestData.image_server = aliveServerList[0];
                            batchDownloadImageServerIp = aliveServerList[0];
                            $.ajax({
                                url: dockerInformationUrl + "node/image_harbor_registry/",
                                type: "POST",
                                cache: false,//设置不缓存
                                data: requestData,
                                success: function (data) {
                                    var resultJsonObject1 = JSON.parse(data);
                                    if (resultJsonObject1["statusCode"] >= 2) {
                                        alert(resultJsonObject1["errMessage"]);
                                    } else {
                                        var imageList = resultJsonObject1["message"];
                                        if (imageList.length == 0) {
                                            batchDownloadImageServerIp = null;
                                            $("#batchDownloadImageList").html("暂无镜像信息！");
                                        } else {
                                            var batchDownloadImageListStr = "";
                                            batchDownloadImageListStr += '<table class="table table-bordered">';
                                            batchDownloadImageListStr += '<tr>';
                                            batchDownloadImageListStr += '<td>选择</td>';
                                            batchDownloadImageListStr += '<td>镜像名</td>';
                                            batchDownloadImageListStr += '<td>下载次数</td>';
                                            batchDownloadImageListStr += '</tr>';
                                            for (var i = 0; i < imageList.length; i++) {
                                                var image = imageList[i];
                                                batchDownloadImageListStr += '<tr>';
                                                batchDownloadImageListStr += '<td><input type="checkbox" name="batchDownloadImageCheckBox" class="batch-download-image-list-check-box-class" value="' + image["name"] + '"></td>';
                                                batchDownloadImageListStr += '<td>' + image["name"] + '</td>';
                                                batchDownloadImageListStr += '<td>' + image["pull_count"] + '</td>';
                                                batchDownloadImageListStr += '</tr>';
                                            }
                                            batchDownloadImageListStr += '</table>';
                                            $("#batchDownloadImageList").html(batchDownloadImageListStr);
                                        }
                                        $("#batchDownloadModelHref").click();
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    if (XMLHttpRequest.status >= 400 && XMLHttpRequest.status < 500) {
                                        alert("客户端请求出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                    } else {
                                        if (XMLHttpRequest.status >= 500 || XMLHttpRequest.status <= 600) {
                                            alert("服务器出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                        } else {
                                            if (XMLHttpRequest.status >= 300 || XMLHttpRequest.status < 400) {
                                                alert("重定向问题！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                            } else {
                                                alert("抱歉，系统好像出现一些异常！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                            }
                                        }
                                    }
                                    // alert(XMLHttpRequest.status);
                                    // alert(XMLHttpRequest.readyState);
                                    // alert(textStatus);
                                }
                            });
                        }
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (XMLHttpRequest.status >= 400 && XMLHttpRequest.status < 500) {
                        alert("客户端请求出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                    } else {
                        if (XMLHttpRequest.status >= 500 || XMLHttpRequest.status <= 600) {
                            alert("服务器出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                        } else {
                            if (XMLHttpRequest.status >= 300 || XMLHttpRequest.status < 400) {
                                alert("重定向问题！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                            } else {
                                alert("抱歉，系统好像出现一些异常！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                            }
                        }
                    }
                    // alert(XMLHttpRequest.status);
                    // alert(XMLHttpRequest.readyState);
                    // alert(textStatus);
                }
            });
        } else {
            alert("没有选择任何节点！");
        }
    }
}


function deleteAll() {
    var nodeCheckBox = null;
    try {
        nodeCheckBox = document.getElementsByClassName("node-check-box");
    } catch (err) {
        console.log(err);
    }
    if (nodeCheckBox == null) {
        alert("没有可选择节点！");
    } else {
        var nodeList = new Array();
        var isSelectNode = false;
        var n = 0;
        for (var i = 0; i < nodeCheckBox.length; i++) {
            var node = nodeCheckBox[i];
            if (node.checked) {
                isSelectNode = true;
                nodeList[n] = node.value;
                n++;
            }
        }
        if (isSelectNode) {
            var isDelete = confirm("确定清除所选节点中的所有环境吗？");
            if (isDelete) {
                alert("清理完成！");
                var obj = new Object();
                obj.hosts = nodeList;
                $.ajax({
                    url: dockerInformationUrl + "image/remove_all/",
                    type: "POST",
                    cache: false,//设置不缓存
                    data: obj,
                    success: function (data) {
                        var resultJsonObject = JSON.parse(data);
                        if (resultJsonObject["statusCode"] >= 2) {
                            alert("删除失败：" + resultJsonObject["errMessage"]);
                        } else {
                            if (resultJsonObject["statusCode"] == 0) {
                                alert("清理完成！");
                            } else {
                                var messageList = resultJsonObject["message"];
                                if (messageList.length == 0) {
                                    alert("清理失败！");
                                } else {
                                    var errorMessage = "部分清理失败：";
                                    for (var i = 0; i < messageList,length; i++) {
                                        var message = messageList[i];
                                        if (message["message"]["statusCode"] != 0) {
                                            errorMessage += "清理" + message["host"] + "上的环境失败，失败原因（" + message["message"]["errMessage"] + "）";
                                        }
                                    }
                                    alert(errorMessage);
                                }
                            }
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (XMLHttpRequest.status >= 400 && XMLHttpRequest.status < 500) {
                            alert("客户端请求出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                        } else {
                            if (XMLHttpRequest.status >= 500 || XMLHttpRequest.status <= 600) {
                                alert("服务器出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                            } else {
                                if (XMLHttpRequest.status >= 300 || XMLHttpRequest.status < 400) {
                                    alert("重定向问题！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                } else {
                                    alert("抱歉，系统好像出现一些异常！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                }
                            }
                        }
                        // alert(XMLHttpRequest.status);
                        // alert(XMLHttpRequest.readyState);
                        // alert(textStatus);
                    }
                });
            }
        } else {
            alert("没有选择任何节点！");
        }
    }
}

function downloadEnvironment(experimentalNodeIp) {
    var nodeList = new Array();
    nodeList[0] = experimentalNodeIp;
    downloadEnvironmentToHosts = nodeList;
    // $("#download-environment-node-ip").val(experimentalNodeIp);
    $.ajax({
        url: dockerInformationUrl + "node/alive_server_list/",
        type: "POST",
        cache: false,//设置不缓存
        success: function (data) {
            var resultJsonObject = JSON.parse(data);
            if (resultJsonObject["statusCode"] >= 2) {
                alert(resultJsonObject["errMessage"]);
            } else {
                var aliveServerList = resultJsonObject["message"];
                if (aliveServerList.length == 0) {
                    alert("没有可用镜像服务器！");
                    downloadEnvironmentServerIp = null;
                } else {
                    var requestData = new Object();
                    requestData.image_server = aliveServerList[0];
                    downloadEnvironmentServerIp = aliveServerList[0];
                    $.ajax({
                        url: dockerInformationUrl + "node/image_harbor_registry/",
                        type: "POST",
                        cache: false,//设置不缓存
                        data: requestData,
                        success: function (data) {
                            var resultJsonObject1 = JSON.parse(data);
                            if (resultJsonObject1["statusCode"] >= 2) {
                                alert(resultJsonObject1["errMessage"]);
                            } else {
                                var imageList = resultJsonObject1["message"];
                                if (imageList.length == 0) {
                                    downloadEnvironmentServerIp = null;
                                    $("#downloadEnvironmentImageList").html("暂无镜像信息！");
                                } else {
                                    var downloadEnvironmentImageListStr = "";
                                    downloadEnvironmentImageListStr += '<table class="table table-bordered">';
                                    downloadEnvironmentImageListStr += '<tr>';
                                    downloadEnvironmentImageListStr += '<td>选择</td>';
                                    downloadEnvironmentImageListStr += '<td>镜像名</td>';
                                    downloadEnvironmentImageListStr += '<td>下载次数</td>';
                                    downloadEnvironmentImageListStr += '</tr>';
                                    for (var i = 0; i < imageList.length; i++) {
                                        var image = imageList[i];
                                        downloadEnvironmentImageListStr += '<tr>';
                                        downloadEnvironmentImageListStr += '<td><input type="checkbox" name="downloadEnvironmentImageCheckBox" class="download-environment-image-check-box-class" value="' + image["name"] + '"></td>';
                                        downloadEnvironmentImageListStr += '<td>' + image["name"] + '</td>';
                                        downloadEnvironmentImageListStr += '<td>' + image["pull_count"] + '</td>';
                                        downloadEnvironmentImageListStr += '</tr>';
                                    }
                                    downloadEnvironmentImageListStr += '</table>';
                                    $("#downloadEnvironmentImageList").html(downloadEnvironmentImageListStr);
                                }
                                $("#downloadEnvironmentModelHref").click();
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            if (XMLHttpRequest.status >= 400 && XMLHttpRequest.status < 500) {
                                alert("客户端请求出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                            } else {
                                if (XMLHttpRequest.status >= 500 || XMLHttpRequest.status <= 600) {
                                    alert("服务器出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                } else {
                                    if (XMLHttpRequest.status >= 300 || XMLHttpRequest.status < 400) {
                                        alert("重定向问题！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                    } else {
                                        alert("抱歉，系统好像出现一些异常！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                    }
                                }
                            }
                            // alert(XMLHttpRequest.status);
                            // alert(XMLHttpRequest.readyState);
                            // alert(textStatus);
                        }
                    });
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status >= 400 && XMLHttpRequest.status < 500) {
                alert("客户端请求出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
            } else {
                if (XMLHttpRequest.status >= 500 || XMLHttpRequest.status <= 600) {
                    alert("服务器出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                } else {
                    if (XMLHttpRequest.status >= 300 || XMLHttpRequest.status < 400) {
                        alert("重定向问题！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                    } else {
                        alert("抱歉，系统好像出现一些异常！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                    }
                }
            }
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

function clearEnvironment(experimentalNodeIp) {
    // $("#delete-environment-node-ip").val(experimentalNodeIp);
    var nodeList = new Array();
    nodeList[0] = experimentalNodeIp;
    clearEnvironmentToHosts = nodeList;
    var obj = new Object();
    obj.hosts = nodeList;
    $.ajax({
        url: dockerInformationUrl + "image/info_list/",
        type: "POST",
        cache: false,//设置不缓存
        data: obj,
        success: function (data) {
            var resultJsonObject = JSON.parse(data);
            if (resultJsonObject["statusCode"] != 0) {
                alert("获取该节点环境列表出错！");
            } else {
                var imageList = resultJsonObject["message"];
                if (imageList.length == 0) {
                    $("#deleteEnvironmentImageList").html("暂无环境！");
                } else {
                    var deleteEnvironmentImageListStr = "";
                    deleteEnvironmentImageListStr += '<table class="table table-bordered">';
                    deleteEnvironmentImageListStr += '<tr>';
                    deleteEnvironmentImageListStr += ' <td>选择</td>';
                    deleteEnvironmentImageListStr += ' <td>镜像名</td>';
                    deleteEnvironmentImageListStr += '<td>镜像ID</td>';
                    deleteEnvironmentImageListStr += '<td>更新时间</td>';
                    deleteEnvironmentImageListStr += '<td>使用状态</td>';
                    deleteEnvironmentImageListStr += '</tr>';
                    for (var i = 0; i < imageList.length; i++) {
                        var image = imageList[i];
                        deleteEnvironmentImageListStr += '<tr>';
                        deleteEnvironmentImageListStr += ' <td><input type="checkbox" name="clearEnvironemntCheckBox" class="clear-environment-check-box-class" value="' + image["tag"] + '"></td>';
                        deleteEnvironmentImageListStr += '<td>' + image["tag"] + '</td>';
                        deleteEnvironmentImageListStr += '<td>' + image["short_id"] + '</td>';
                        deleteEnvironmentImageListStr += '<td>' + image["created"] + '</td>';
                        deleteEnvironmentImageListStr += '<td>' + image["statue"] + '</td>';
                        deleteEnvironmentImageListStr += '</tr>';
                    }
                    $("#deleteEnvironmentImageList").html(deleteEnvironmentImageListStr);
                }
                $("#deleteEnvironmentModelHref").click();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status >= 400 && XMLHttpRequest.status < 500) {
                alert("客户端请求出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
            } else {
                if (XMLHttpRequest.status >= 500 || XMLHttpRequest.status <= 600) {
                    alert("服务器出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                } else {
                    if (XMLHttpRequest.status >= 300 || XMLHttpRequest.status < 400) {
                        alert("重定向问题！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                    } else {
                        alert("抱歉，系统好像出现一些异常！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                    }
                }
            }
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

function getNodeNumberEachGroup() {
    $.ajax({
        url: "/get_node_number_each_group",
        type: "POST",
        cache: false,//设置不缓存
        success: getNodeNumberEachGroupSuccess,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status >= 400 && XMLHttpRequest.status < 500) {
                alert("客户端请求出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
            } else {
                if (XMLHttpRequest.status >= 500 || XMLHttpRequest.status <= 600) {
                    alert("服务器出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                } else {
                    if (XMLHttpRequest.status >= 300 || XMLHttpRequest.status < 400) {
                        alert("重定向问题！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                    } else {
                        alert("抱歉，系统好像出现一些异常！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                    }
                }
            }
        }
    });
}

function getNodeNumberEachGroupSuccess(data) {
    try {
        $("#node-number-each-group").val(data.trim());
        isGetNodeNumberEachGroup = false;
    } catch (err) {
        console.log(err);
    }
}

function isInteger(obj) {
    return obj%1 === 0
}

function changeNodeGroup() {
    if (confirm("您确定要重新设置分组吗？如果有实验节点正在使用，则会进行强制关闭，关闭节点的时间可能较长，请耐心等待！")) {
        var groupCount = $("#node-number-each-group").val();
        if (groupCount == "" || groupCount == null) {
            alert("每组节点数不能为空！");
        } else {
            if (isInteger(groupCount)) {
                var obj = new Object();
                obj.groupCount = groupCount;
                $.ajax({
                    url: "/change_node_group",
                    type: "POST",
                    cache: false,//设置不缓存
                    data: obj,
                    success: changeNodeGroupSuccess,
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (XMLHttpRequest.status >= 400 && XMLHttpRequest.status < 500) {
                            alert("客户端请求出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                        } else {
                            if (XMLHttpRequest.status >= 500 || XMLHttpRequest.status <= 600) {
                                alert("服务器出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                            } else {
                                if (XMLHttpRequest.status >= 300 || XMLHttpRequest.status < 400) {
                                    alert("重定向问题！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                } else {
                                    alert("抱歉，系统好像出现一些异常！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                }
                            }
                        }
                    }
                });
            } else {
                alert("每组节点数必须是整数！");
            }
        }
    }
}

function changeNodeGroupSuccess(data) {
    if (data.indexOf("ok") == 0) {
        alert("设置成功！");
        window.location.reload();
    } else {
        if (data.indexOf("用户未登录！") == 0 || data.indexOf("抱歉，仅有教师可以设置分组！") == 0) {
            window.location.href = "/index.html";
        } else {
            alert(data);
        }
    }
}

function batchDownloadImage() {
    if (batchDownloadImageServerIp == null) {
        alert("无法下载！");
    } else {
        var imageCheckBox = null;
        try {
            imageCheckBox = document.getElementsByClassName("batch-download-image-list-check-box-class");
        } catch (err) {
            console.log(err);
        }
        if (imageCheckBox == null) {
            alert("没有可选的镜像！");
        } else {
            var isSelectImage = false;
            var imageList = new Array();
            var n = 0;
            for (var i = 0; i < imageCheckBox.length; i++) {
                var image = imageCheckBox[i];
                if (image.checked) {
                    isSelectImage = true;
                    imageList[n] = image.value;
                    n++;
                }
            }
            if (isSelectImage) {
                if (batchDownloadImageToHosts == null) {
                    alert("没有选择节点！");
                } else {
                    var obj = new Object();
                    obj.to_hosts = batchDownloadImageToHosts;
                    obj.images = imageList;
                    obj.image_server = batchDownloadImageServerIp;
                    $.ajax({
                        url: dockerInformationUrl + "node/download_list/",
                        type: "POST",
                        cache: false,//设置不缓存
                        data: obj,
                        success: function (data) {
                            var resultJsonObject = JSON.parse(data);
                            if (resultJsonObject["statusCode"] >= 2) {
                                alert(resultJsonObject["errMessage"]);
                            } else {
                                if (resultJsonObject["statusCode"] == 0) {
                                    alert("下载成功！");
                                    $("#batchDownloadModelClose").click();
                                } else {
                                    var resultMessage = resultJsonObject["message"];
                                    if (resultMessage.length == 0) {
                                        alert("下载失败！");
                                    } else {
                                        var resultStr = "部分下载失败：";
                                        for (var i = 0; i < resultMessage.length; i++) {
                                            var resultMessageOne = resultMessage[i];
                                            if (resultMessageOne["message"]["statusCode"] != 0) {
                                                resultStr += "往" + resultMessageOne["host"] + "下载镜像" + resultMessageOne["repository"] + "出错，错误信息（" + resultMessageOne["message"]["errMessage"] + "）";
                                                resultStr += "\n";
                                            }
                                        }
                                        alert(resultStr);
                                    }
                                }
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            if (XMLHttpRequest.status >= 400 && XMLHttpRequest.status < 500) {
                                alert("客户端请求出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                            } else {
                                if (XMLHttpRequest.status >= 500 || XMLHttpRequest.status <= 600) {
                                    alert("服务器出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                } else {
                                    if (XMLHttpRequest.status >= 300 || XMLHttpRequest.status < 400) {
                                        alert("重定向问题！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                    } else {
                                        alert("抱歉，系统好像出现一些异常！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                    }
                                }
                            }
                        }
                    });
                }
            } else {
                alert("没有选择任何镜像！");
            }
        }
    }
}

function downloadEnvironmentImage() {
    if (downloadEnvironmentServerIp == null) {
        alert("无法下载！");
    } else {
        var imageCheckBox = null;
        try {
            imageCheckBox = document.getElementsByClassName("download-environment-image-check-box-class");
        } catch (err) {
            console.log(err);
        }
        if (imageCheckBox == null) {
            alert("没有可选的镜像！");
        } else {
            var isSelectImage = false;
            var imageList = new Array();
            var n = 0;
            for (var i = 0; i < imageCheckBox.length; i++) {
                var image = imageCheckBox[i];
                if (image.checked) {
                    isSelectImage = true;
                    imageList[n] = image.value;
                    n++;
                }
            }
            if (isSelectImage) {
                if (downloadEnvironmentToHosts == null) {
                    alert("没有选择节点！");
                } else {
                    var obj = new Object();
                    obj.to_hosts = downloadEnvironmentToHosts;
                    obj.images = imageList;
                    obj.image_server = downloadEnvironmentServerIp;
                    $.ajax({
                        url: dockerInformationUrl + "node/download_list/",
                        type: "POST",
                        cache: false,//设置不缓存
                        data: obj,
                        success: function (data) {
                            var resultJsonObject = JSON.parse(data);
                            if (resultJsonObject["statusCode"] >= 2) {
                                alert("下载失败：" + resultJsonObject["errMessage"]);
                            } else {
                                if (resultJsonObject["statusCode"] == 0) {
                                    alert("下载成功！");
                                    $("#downloadEnvironmentModelClose").click();
                                } else {
                                    var resultMessage = resultJsonObject["message"];
                                    if (resultMessage.length == 0) {
                                        alert("下载失败！");
                                    } else {
                                        var resultStr = "部分下载失败：";
                                        for (var i = 0; i < resultMessage.length; i++) {
                                            var resultMessageOne = resultMessage[i];
                                            if (resultMessageOne["message"]["statusCode"] != 0) {
                                                resultStr += "往" + resultMessageOne["host"] + "下载镜像" + resultMessageOne["repository"] + "出错，错误信息（" + resultMessageOne["message"]["errMessage"] + "）";
                                                resultStr += "\n";
                                            }
                                        }
                                        alert(resultStr);
                                    }
                                }
                            }
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            if (XMLHttpRequest.status >= 400 && XMLHttpRequest.status < 500) {
                                alert("客户端请求出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                            } else {
                                if (XMLHttpRequest.status >= 500 || XMLHttpRequest.status <= 600) {
                                    alert("服务器出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                } else {
                                    if (XMLHttpRequest.status >= 300 || XMLHttpRequest.status < 400) {
                                        alert("重定向问题！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                    } else {
                                        alert("抱歉，系统好像出现一些异常！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                    }
                                }
                            }
                        }
                    });
                }
            } else {
                alert("没有选择任何镜像！");
            }
        }
    }
}

function clearEnvironmentImage() {
    var imageCheckBox = null;
    try {
        imageCheckBox = document.getElementsByClassName("clear-environment-check-box-class");
    } catch (err) {
        console.log(err);
    }
    if (imageCheckBox == null) {
        alert("没有可选镜像！");
    } else {
        var isImageSelect = false;
        var imageList = new Array();
        var n = 0;
        for (var i = 0; i < imageCheckBox.length; i++) {
            var image = imageCheckBox[i];
            if (image.checked) {
                isImageSelect = true;
                imageList[n] = image.value;
                n++;
            }
        }
        if (isImageSelect) {
            if (clearEnvironmentToHosts == null) {
                alert("没有选择任何节点！");
            } else {
                var hosts = new Array();
                for (var j = 0; j < imageList.length; j++) {
                    hosts[j] = clearEnvironmentToHosts[0];
                }
                var obj = new Object();
                obj.hosts = hosts;
                obj.action = "remove";
                obj.images = imageList;
                var args = new Object();
                args.force = true;
                obj.args = args;
                $.ajax({
                    url: dockerInformationUrl + "image/operator_list/",
                    type: "POST",
                    cache: false,//设置不缓存
                    data: obj,
                    success: function (data) {
                        var resultJsonObject = JSON.parse(data);
                        if (resultJsonObject["statusCode"] >= 2) {
                            alert("删除失败：" + resultJsonObject["errMessage"]);
                        } else {
                            if (resultJsonObject["statusCode"] == 0) {
                                alert("删除成功！");
                                $("#deleteEnvironmentModelClose").click();
                            } else {
                                var resultMessage = resultJsonObject["message"];
                                if (resultMessage.length == 0) {
                                    alert("删除失败！");
                                } else {
                                    var resultStr = "部分删除失败：";
                                    for (var i = 0; i < resultMessage.length; i++) {
                                        var resultMessageOne = resultMessage[i];
                                        if (resultMessageOne["message"]["statusCode"] != 0) {
                                            resultStr += "删除" + resultMessageOne["host"] + "节点镜像" + resultMessageOne["image"] + "出错，错误信息（" + resultMessageOne["message"]["errMessage"] + "）";
                                            resultStr += "\n";
                                        }
                                    }
                                    alert(resultStr);
                                }
                            }
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (XMLHttpRequest.status >= 400 && XMLHttpRequest.status < 500) {
                            alert("客户端请求出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                        } else {
                            if (XMLHttpRequest.status >= 500 || XMLHttpRequest.status <= 600) {
                                alert("服务器出错！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                            } else {
                                if (XMLHttpRequest.status >= 300 || XMLHttpRequest.status < 400) {
                                    alert("重定向问题！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                } else {
                                    alert("抱歉，系统好像出现一些异常！错误代码（" + XMLHttpRequest.status + "," + XMLHttpRequest.readyState + "," + textStatus + "）");
                                }
                            }
                        }
                    }
                });
            }
        } else {
            alert("没有选择任何环境！");
        }
    }
}

$(document).ready(function () {
    getNodeInformation();
    setInterval(getNodeInformation, 2000);
});
/**
 * Created by 郭欣光 on 2018/4/7.
 */

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
        str += '<div class="col-sm-2"><button type="button" class="btn btn-success">确认</button></div>';
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
            $("#batchDownloadModelHref").click();
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
            }
        } else {
            alert("没有选择任何节点！");
        }
    }
}

function downloadEnvironment(experimentalNodeIp) {
    $("#download-environment-node-ip").val(experimentalNodeIp);
    $("#downloadEnvironmentModelHref").click();
}

function clearEnvironment(experimentalNodeIp) {
    $("#delete-environment-node-ip").val(experimentalNodeIp);
    $("#deleteEnvironmentModelHref").click();
}

$(document).ready(function () {
    getNodeInformation();
    setInterval(getNodeInformation, 2000);
});
function selectIP(ip) {
	var selectNode = document.getElementById(ip);//获取点击的节点
	var selectIP = selectNode.innerHTML;//获取要转向的vnc的IP
	var activeLink = document.getElementsByClassName("active");//获取class为active的对象
	//将原有的active特效清除
	for (var i = 0;i < activeLink.length ;i++) {
		var link = activeLink[i];
		if (link.id.indexOf("ip-") != -1) {
			link.className = "";
		}
	}
	selectNode.className = "active";
	document.getElementById("terminal").contentWindow.location.href = "/experiment/loading_request.html?ip=" + selectIP;//跳转到等待页面
	var windowWidth = window.screen.availWidth;
	var windowHeight = window.screen.availHeight;
	var screenSize = parseInt(0.38*windowWidth) + "x" + parseInt(0.57*windowHeight);
	var obj = new Object();
	obj.screenSize = screenSize;
	obj.ip = selectIP;
	$.ajax({
		url: "/select_one_vnc_node",
		type: "POST",
		cache: false,//设置不缓存
		data: obj,
		success: selectIPSuccess,
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
	// document.getElementById("terminal").contentWindow.location.href = "http://" + selectIP + ":6080/vnc.html";//跳转到相应终端
	// alert("您已成功连接：" + selectIP);
}

function selectIPSuccess(data) {
	if(data.indexOf("ok:") == 0) {
		var ip = data.split("ok:")[1];
		setTimeout(selectIpJumpLink, 1500, ip);
		// document.getElementById("terminal").contentWindow.location.href = "http://" + ip + ":6080/vnc.html";//跳转到相应终端
		// alert("您已成功连接：" + ip);
	} else {
		if(data.indexOf("没用用户！") == 0) {
			// document.getElementById("checkCodeImage").src = "/get_check_code?imageId=" + Math.random();
			// document.getElementById("userLogin").click();
		} else {
			document.getElementById("terminal").contentWindow.location.href = "/experiment/loading_error.html?errorText=" + data + "<br/>您可刷新页面重新为您分配IP";//跳转到错误页面
			alert(data + "\n您可刷新页面重新为您分配IP");
		}
	}
}

function selectIpJumpLink(ip) {
	document.getElementById("terminal").contentWindow.location.href = "http://" + ip + ":6080/vnc.html";//跳转到相应终端
	alert("您已成功连接：" + ip);
}
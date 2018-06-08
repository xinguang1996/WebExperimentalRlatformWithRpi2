/**
 * 获取用户信息
 */
var userName = "";
var releaseExperimentCharacteristic = false;
var gotoExperimentalReportCharacteristic = false;
var gotoNodeManagementCharacteristic = false;
var isFirst = true;
function getUserInfo() {
	$.ajax({
		url: "/get_user",
		type: "POST",
		cache: false,//设置不缓存
		success: getUserSuccess,
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
	return false;
}

function getUserSuccess(data) {
	if(data.indexOf("error:") != -1) {
		if (releaseExperimentCharacteristic || gotoExperimentalReportCharacteristic || gotoNodeManagementCharacteristic) {
			document.getElementById("checkCodeImage").src = "/get_check_code?imageId=" + Math.random();
			document.getElementById("userLogin").click();
		}
		// window.location.href = "/index.html";
		// document.getElementById("checkCodeImage").src = "/get_check_code?imageId=" + Math.random();
		// document.getElementById("userLogin").click();
	} else {
		var user = JSON.parse(data);
		userName = user['name'];
		var role = user['role'];
		if (role.indexOf("教师") == 0) {
			teacherGetCoursesTop5();
		} else {
			var str = "<ul class='nav navbar-nav'>" +
				"<li class='dropdown'>" +
				"<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>" +
				"我的课程" +
				"</a>" +
				"<ul class='dropdown-menu'>" +
				"<li><a class='' href='#'>Linux基础入门新版</a></li>" +
				"<li><a class=''  href='#'>高级bash编程指南</a></li>" +
				"<li><a class=''  href='#'>java实现记事本</a></li>" +
				"<li><a class='' href='#' >python实现文字聊天室</a></li>" +
				"<li><a class=''  href='#'>查看更多</a></li>" +
				"</ul>" +
				"</li>" +
				"</ul>" +
				"<ul class='nav navbar-nav'>" +
				"<li class='dropdown'>" +
				"<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>" +
				"欢迎您，" + userName +
				"</a>" +
				"<ul class='dropdown-menu'>" +
				"<li><a class='' href='/home/index.html' >我的主页</a></li>" +
				"<li><a class='' href='#' onclick='javascript:signOut(); return false;' data-toggle='modal' data-target='#signOutModel'>退出登录</a></li>" +
				"</ul>" +
				"</li>" +
				"</ul>";
			document.getElementById("userInfo").innerHTML = str;
		}
		if (releaseExperimentCharacteristic) {
			releaseExperimentCharacteristic = false;
			if(role.indexOf("教师") == 0) {
				window.location.href="/developer/index.html";
			} else {
				alert("抱歉，您的身份是：" + role + "  仅有教师可以发布实验！");
			}
		} else {
			if (gotoExperimentalReportCharacteristic) {
				gotoExperimentalReportCharacteristic = false;
				if(role.indexOf("教师") == 0) {
					window.location.href="/experimental_report/index.html";
				} else {
					alert("抱歉，您的身份是：" + role + "  仅有教师可以查看实验报告！");
				}
			}
			if (gotoNodeManagementCharacteristic) {
				gotoNodeManagementCharacteristic = false;
				if(role.indexOf("教师") == 0) {
					window.location.href="/node_management/index.html";
				} else {
					alert("抱歉，您的身份是：" + role + "  仅有教师可以进行节点管理！");
				}
			}
		}
		// setInterval(keepVNCConnection, 10000);
		// getExperimentalNode();
		// getCourseInformation();
		// document.getElementById("closeLogin").click();
	}
	if (isFirst) {
		isFirst = false;
		setInterval(keepVNCConnection, 10000);
		getExperimentalNode();
		setInterval("checkExperimentalNode()", 1000);
	}
	return false;
}

function getExperimentalNode() {
	$.ajax({
		url: "/get_all_available_experimental_node",
		type: "POST",
		cache: false,//设置不缓存
		success: getExperimentalNodeSuccess,
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

function getExperimentalNodeSuccess(data) {
	if (data.indexOf("暂无实验节点！") == 0) {
		document.getElementById("experimentalIp").innerHTML = "<li><a class=\"\" href=\"\">" + data + "</a></li>";
	} else {
		if (data.indexOf("未正确获得客户端IP！") == 0) {
			alert(data);
			window.location.href = "/courses/index.html";
		} else {
			var str = "";
			var obj = JSON.parse(data);
			var experimentalNodeList = obj['experimentalNodeList'];
			for (var i = 0; i < experimentalNodeList.length; i++) {
				str += "<li><a class=\"\" href=\"\" onclick=\"javascript:selectIP('ip-" + experimentalNodeList[i].ip.split(".")[3] + "'); return false;\" id=\"ip-" + experimentalNodeList[i].ip.split(".")[3] + "\">" + experimentalNodeList[i].ip + "</a></li>";
			}
			document.getElementById("experimentalIp").innerHTML = str;
		}
	}
	getVNCNode();
	getCourseInformation();
}

function login() {
	var id = document.getElementById("id").value;
	var password = document.getElementById("password").value;
	var checkCode = document.getElementById("checkCode").value;
	if(id == "" || password == "" || checkCode == "") {
		// alert("所有字段不允许为空！");
		document.getElementById("loginError").style.display = "block";
		document.getElementById("loginErrorMessage").innerHTML = "所有字段不可以为空！";
		document.getElementById("checkCodeImage").src = "/get_check_code?imageId=" + Math.random();
		setTimeout(clearLoginError, 1500);
		return false;
	}
	var obj = new Object();
	obj.id = id;
	obj.password = password;
	obj.checkCode = checkCode;

	$.ajax({
		url: "/login",
		type: "POST",
		cache: false,//设置不缓存
		data: obj,
		success: loginSuccess,
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
	return false;
}

function loginSuccess(data) {
	if(data.indexOf("ok") != -1) {
		getUserInfo();
		document.getElementById("closeLogin").click();
	} else {
		// alert(data);
		document.getElementById("loginError").style.display = "block";
		document.getElementById("loginErrorMessage").innerHTML = data;
		document.getElementById("checkCodeImage").src = "/get_check_code?imageId=" + Math.random();
		setTimeout(clearLoginError, 1500);
		return false;
	}
}

function clearLoginError() {
	if(document.getElementById("loginError").style.display.indexOf("block") == 0) {
		document.getElementById("loginError").style.display = "none";
		document.getElementById("loginErrorMessage").innerHTML = "";
	}
}

function signOut() {
	$.ajax({
		url: "/sign_out",
		type: "POST",
		cache: false,//设置不缓存
		success: signOutSuccess,
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

function signOutSuccess(data) {
	if(data.indexOf("ok") != -1) {
		window.location.href="/index.html";
	} else {
		alert(data);
		// alert("退出失败！");
	}
}

function getVNCNode() {
	var windowWidth = window.screen.availWidth;
	var windowHeight = window.screen.availHeight;
	var screenSize = parseInt(0.38*windowWidth) + "x" + parseInt(0.57*windowHeight);
	var obj = new Object();
	obj.screenSize = screenSize;
	$.ajax({
		url: "/get_one_free_vnc",
		type: "POST",
		data: obj,
		cache: false,//设置不缓存
		success: getVNCNodeSuccess,
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

function getVNCNodeSuccess(data) {
	if(data.indexOf("ok:") == 0) {
		var ip = data.split("ok:")[1];
		document.getElementById("terminal").contentWindow.location.href = "/experiment/loading_request.html?ip=" + ip;//跳转到等待页面
		var activeLink = document.getElementsByClassName("active");//获取class为active的对象
		//将原有的active特效清除
		for (var i = 0;i < activeLink.length ;i++) {
			var link = activeLink[i];
			if (link.id.indexOf("ip-") != -1) {
				link.className = "";
			}
		}
		var idName = "ip-" + ip.split(".")[3];
		var selectNode = document.getElementById(idName);//获取点击的节点
		selectNode.className = "active";
		setTimeout(jumpLink, 1500, ip);
		// document.getElementById("terminal").contentWindow.location.href = "http://" + ip + ":6080/vnc.html";//跳转到相应终端
		// setInterval(keepVNCConnection, 10000, ip);
		// alert("您已成功连接：" + ip);
	} else {
		if(data.indexOf("没有用户！") == 0) {
			// document.getElementById("checkCodeImage").src = "/get_check_code?imageId=" + Math.random();
			// document.getElementById("userLogin").click();
		} else {
			if (data.indexOf("未正确获得客户端IP！") == 0 || data.indexOf("没有空余的节点，请稍后再次连接！") == 0 || data.indexOf("操作打开vnc服务时数据库出错！") == 0) {
				document.getElementById("terminal").contentWindow.location.href = "/experiment/loading_error.html?errorText=" + data;//跳转到错误页面
				alert(data);
			} else {
				document.getElementById("terminal").contentWindow.location.href = "/experiment/loading_error.html?errorText=" + data + "<br/>将继续寻找下一个可用节点！";//跳转到错误页面
				alert(data + "\n将继续寻找下一个可用节点！");
				getVNCNode();
			}
		}
	}
}

function jumpLink(ip) {
	document.getElementById("terminal").contentWindow.location.href = "http://" + ip + ":6080/vnc.html";//跳转到相应终端
	// setInterval(keepVNCConnection, 10000, ip);
	alert("您已成功连接：" + ip);
}

function keepVNCConnection() {
	$.ajax({
		url: "/keep_vnc_connection",
		type: "POST",
		cache: false,//设置不缓存
		success: keepVNCConnectionSuccess,
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

function keepVNCConnectionSuccess(data) {
	console.log(data);
}

function releaseExperiment() {
	gotoExperimentalReportCharacteristic = false;
	gotoNodeManagementCharacteristic = false;
	releaseExperimentCharacteristic = true;
	getUserInfo();
}

// function checkUserSuccess(data) {
// 	if(data.indexOf("error:") != -1) {
// 		getUserInfo();
// 	} else {
// 		var user = JSON.parse(data);
// 		var role = user['role'];
// 		if(role.indexOf("教师") == 0) {
// 			window.location.href="/developer/index.html";
// 		} else {
// 			alert("抱歉，您的身份是：" + role + "  仅有教师可以发布实验！");
// 		}
// 	}
// 	return false;
// }

function getCourseInformation() {
	if(window.location.href.indexOf("?") != -1) {
		if(window.location.href.split("?")[1].indexOf("&") != -1) {
			if(window.location.href.split("?")[1].split("&")[0].indexOf("=") != -1) {
				var courseId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
				var obj = new Object();
				obj.courseId = courseId;
				$.ajax({
					url: "/get_course_info",
					type: "POST",
					cache: false,//设置不缓存
					data: obj,
					success: getCourseInformationSuccess,
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
				alert("找不到课程内容！");
				window.location.href = "/courses/index.html";
			}
		} else {
			alert("找不到课程内容！");
			window.location.href = "/courses/index.html";
		}
	} else {
		alert("找不到课程内容！");
		window.location.href = "/courses/index.html";
	}
}

function getCourseInformationSuccess(data) {
	if (data.indexOf("没有该课程！") == 0) {
		alert(data);
		window.location.href = "/courses/index.html";
	} else {
		var course = JSON.parse(data);
		document.title = course['name'] + " - Cloud Lab";
		document.getElementById("courseTab").innerHTML = "<a href=\"/courses/index.html?tag=" + course['tab'] + "&page=1\">" + course['tab'] + "</a>";
		document.getElementById("courseNameHref").innerHTML = "<a href=\"/courses/show.html?courseId=" + course['id'] + "\">" + course['name'] + "</a>";
		getExperimentalInformation();
		// document.getElementById("courseName").innerHTML = course['name'];
		// document.getElementById("courseDescription").innerHTML = course['description'];
		// var createTime = course['createTime'];
		// var modificationTime = course['modificationTime'];
		// createTime = createTime.split(".")[0];
		// modificationTime = modificationTime.split(".")[0];
		// document.getElementById("courseCreateTime").innerHTML = createTime;
		// document.getElementById("courseModificationTime").innerHTML = modificationTime;
		// document.getElementById("courseImg").src = "/user/course/img/" + course['img'];
		// document.getElementById("courseImgMobile").src = "/user/course/img/" + course['img'];
		// getCourseTeacherInformation(course['teacher']);
		// getCoursesCount(course['teacher']);
	}
}

function getExperimentalInformation() {
	if(window.location.href.indexOf("?") != -1) {
		if(window.location.href.split("?")[1].indexOf("&") != -1) {
			if(window.location.href.split("?")[1].split("&")[1].indexOf("=") != -1) {
				var experimentalId = window.location.href.split("?")[1].split("&")[1].split("=")[1];
				var obj = new Object();
				obj.experimentalId = experimentalId;
				$.ajax({
					url: "/get_experimental_document",
					type: "POST",
					cache: false,//设置不缓存
					data: obj,
					success: getExperimentalInformationSuccess,
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
				alert("获取实验信息失败！");
				window.location.href = "/courses/index.html";
			}
		} else {
			alert("获取实验信息失败！");
			window.location.href = "/courses/index.html";
		}
	} else {
		alert("获取实验信息失败！");
		window.location.href = "/courses/index.html";
	}
}

function getExperimentalInformationSuccess(data) {
	if(data.indexOf("error:") == 0) {
		alert(data.split("error:")[1]);
		window.location.href = "/courses/index.html";
	} else {
		var experimentalInformation = JSON.parse(data);
		document.title = experimentalInformation['title'] + " - Cloud Lab";
		document.getElementById("experimentalDoc").contentWindow.location.href = "/user/course/experimental/" + experimentalInformation['courseId'] + "/" + experimentalInformation['name'] + "?experimentalNoCache=" + Math.random();//跳转到实验文档页面
		// document.getElementById("experimentalDocumentTitle").innerHTML = experimentalInformation['title'];
		// if(experimentalInformation['content'].indexOf("pdf") == 0) {
		// 	var windowHeight = window.screen.availHeight;
		// 	var str = "<iframe id = \"experimentalDoc\" name=\"experimentalDoc\" frameborder=\"0\" src=\"" + experimentalInformation['experimentalUrl'] + "?experimentalNoCache=" + Math.random() + "\" height=\"" + (0.55 * windowHeight) + "px\" width=\"100%\" ></iframe>";
		// 	document.getElementById("labs").innerHTML = str;
		// } else {
		// 	document.getElementById("labs").innerHTML = experimentalInformation['content'];
		// }
	}
}

function teacherGetCoursesTop5() {
	$.ajax({
		url: "/get_my_courses_top_5",
		type: "POST",
		cache: false,//设置不缓存
		success: teacherGetCoursesTop5Success,
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

function teacherGetCoursesTop5Success(data) {
	if(data.indexOf("没有用户！") == 0) {
		setTimeout("teacherGetCoursesTop5()", 500);
	} else {
		if(data.indexOf("没有课程！") == 0) {
			var str = "<ul class='nav navbar-nav'>" +
				"<li class='dropdown'>" +
				"<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>" +
				"我的课程" +
				"</a>" +
				"<ul class='dropdown-menu'>" +
				"<li><a class='' href=''>" + data + "</a></li>" +
				"</ul>" +
				"</li>" +
				"</ul>" +
				"<ul class='nav navbar-nav'>" +
				"<li class='dropdown'>" +
				"<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>" +
				"欢迎您，" + userName +
				"</a>" +
				"<ul class='dropdown-menu'>" +
				"<li><a class='' href='/home/index.html' >我的主页</a></li>" +
				"<li><a class='' href='/add_user/index.html' >添加用户</a></li>" +
				"<li><a class='' href='' onclick='javascript:signOut(); return false;' data-toggle='modal' data-target='#signOutModel'>退出登录</a></li>" +
				"</ul>" +
				"</li>" +
				"</ul>";
			document.getElementById("userInfo").innerHTML = str;
		} else {
			var str = "<ul class='nav navbar-nav'>" +
				"<li class='dropdown'>" +
				"<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>" +
				"我的课程" +
				"</a>" +
				"<ul class='dropdown-menu'>";
			var courses = JSON.parse(data)['teacherCourses'];
			for(var i = 0; i < courses.length; i++) {
				var course = courses[i];
				str += "<li><a class='' href='/developer/course_information.html?courseID=" + course.id + "'>" + course.name + "</a></li>";
			}
			if (courses.length >= 5) {
				str += "<li><a class=''  href='/developer/index.html'>查看更多</a></li>" ;
			}
			str += "</ul>" +
				"</li>" +
				"</ul>" +
				"<ul class='nav navbar-nav'>" +
				"<li class='dropdown'>" +
				"<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>" +
				"欢迎您，" + userName +
				"</a>" +
				"<ul class='dropdown-menu'>" +
				"<li><a class='' href='/home/index.html' >我的主页</a></li>" +
				"<li><a class='' href='/add_user/index.html' >添加用户</a></li>" +
				"<li><a class='' href='' onclick='javascript:signOut(); return false;' data-toggle='modal' data-target='#signOutModel'>退出登录</a></li>" +
				"</ul>" +
				"</li>" +
				"</ul>";
			document.getElementById("userInfo").innerHTML = str;
		}
	}
}

function gotoExperimentalReport() {
	releaseExperimentCharacteristic = false;
	gotoNodeManagementCharacteristic = false;
	gotoExperimentalReportCharacteristic = true;
	getUserInfo();
}

function checkExperimentalNode() {
	$.ajax({
		url: "/get_all_available_experimental_node",
		type: "POST",
		cache: false,//设置不缓存
		success: checkExperimentalNodeSuccess,
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

function checkExperimentalNodeSuccess(data) {
	if (data.indexOf("暂无实验节点！") == 0) {
		document.getElementById("experimentalIp").innerHTML = "<li><a class=\"\" href=\"\">" + data + "</a></li>";
	} else {
		if (data.indexOf("未正确获得客户端IP！") != 0) {
			var activeId = "";
			var activeLink = document.getElementsByClassName("active");//获取class为active的对象
			for (var i = 0;i < activeLink.length ;i++) {
				var link = activeLink[i];
				if (link.id.indexOf("ip-") != -1) {
					activeId = link.id;
					break;
				}
			}
			var str = "";
			var obj = JSON.parse(data);
			var experimentalNodeList = obj['experimentalNodeList'];
			for (var i = 0; i < experimentalNodeList.length; i++) {
				str += "<li><a class=\"\" href=\"\" onclick=\"javascript:selectIP('ip-" + experimentalNodeList[i].ip.split(".")[3] + "'); return false;\" id=\"ip-" + experimentalNodeList[i].ip.split(".")[3] + "\">" + experimentalNodeList[i].ip + "</a></li>";
			}
			document.getElementById("experimentalIp").innerHTML = str;
			if (activeId != "") {
				var selectNode = document.getElementById(activeId);//获取点击的节点
				selectNode.className = "active";
			}
		}
	}
}

function gotoNodeManagement() {
	releaseExperimentCharacteristic = false;
	gotoExperimentalReportCharacteristic = false;
	gotoNodeManagementCharacteristic = true;
	getUserInfo();
}

$(document).ready(function() {
	// document.getElementById("userLogin").click();
	getUserInfo();
	// document.getElementById("terminal").contentWindow.location.href = "http://192.168.1.101:6080/vnc.html";
	// alert("您已成功连接：192.168.1.101");
});
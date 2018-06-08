/**
 * Created by 郭欣光 on 2018/3/25.
 */

var releaseExperimentCharacteristic = false;
var gotoExperimentalReportCharacteristic = false;
var gotoNodeManagementCharacteristic = false;
var userName = "";
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

/**
 * 获取用户信息成功之后的处理
 * @param data
 * @returns {boolean}
 */
function getUserSuccess(data) {
    if(data.indexOf("error:") != -1) {
        document.getElementById("checkCodeImage").src = "/get_check_code?imageId=" + Math.random();
        document.getElementById("userLogin").click();
    } else {
        var user = JSON.parse(data);
        userName = user['name'];
        role = user['role'];
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
        if(releaseExperimentCharacteristic) {
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
            } else {
                if (gotoNodeManagementCharacteristic) {
                    gotoNodeManagementCharacteristic = false;
                    if(role.indexOf("教师") == 0) {
                        window.location.href="/node_management/index.html";
                    } else {
                        alert("抱歉，您的身份是：" + role + "  仅有教师可以进行节点管理！");
                    }
                }
            }
        }
        setInterval(keepUserConnection, 60000);
        // getVNCNode();
        // document.getElementById("closeLogin").click();
    }
    return false;
}


/**
 * 用于处理登录
 * @returns {boolean}
 */
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

/**
 * ajax登录请求成功的回调函数
 * @param data
 * @returns {boolean}
 */
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

/**
 * 退出登录处理
 */
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

/**
 * ajax请求用户退出成功时的回调函数
 * @param data
 */
function signOutSuccess(data) {
    if(data.indexOf("ok") != -1) {
        window.location.href="/index.html";
    } else {
        alert(data);
        // alert("退出失败！");
    }
}

/**
 * 用于保持用户的连接
 */
function keepUserConnection() {
    $.ajax({
        url: "/keep_user_connection",
        type: "POST",
        cache: false,//设置不缓存
        success: keepUserConnectionSuccess,
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

/**
 * ajax请求用户保持连接成功的回调函数
 * @param data
 */
function keepUserConnectionSuccess(data) {
    if(data.indexOf("error") == 0) {
        var str = "<a class=\"btn btn-default navbar-btn sign-in\" data-sign=\"signin\" href=\"#sign-modal\" data-toggle=\"modal\" id=\"userLogin\">登录</a>" +
            "<a class=\"btn btn-default navbar-btn sign-up\" data-sign=\"signup\" href=\"#sign-modal\" data-toggle=\"modal\">注册</a>";
        document.getElementById("userInfo").innerHTML = str;
    }
    console.log(data);
}

/**
 * 进入发布实验页面前的处理
 */
function releaseExperiment() {
    gotoExperimentalReportCharacteristic = false;
    gotoNodeManagementCharacteristic = false;
    releaseExperimentCharacteristic = true;
    getUserInfo();
}

/**
 * ajax初始化获取用户信息请求成功后的回调函数
 * @param data
 * @returns {boolean}
 */
function getInitUserSuccess(data) {
    if(data.indexOf("error:") != -1) {

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
    }
    return false;
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

function resetPassword() {
    var id = document.getElementById("resetPasswordId").value;
    var name = document.getElementById("resetPasswordName").value;
    var email = document.getElementById("resetPasswordEmail").value;
    var tel = document.getElementById("resetPasswordTel").value;
    var newPassword = document.getElementById("resetPasswordNewPassword").value;
    var repeatPassword = document.getElementById("resetPasswordRepeatPassword").value;
    if (id == null || id == "" || id.length == 0 || name == null || name == "" || name.length == 0 || email == null || email == "" || email.length == 0 || tel == null || tel == "" || tel.length == 0 || newPassword == null || newPassword == "" || newPassword.length == 0 || repeatPassword == null || repeatPassword == "" || repeatPassword.length == 0) {
        alert("所有字段不能为空！");
    } else {
        if (id.length > 8) {
            alert("账号长度不能超过8字节！");
        } else {
            if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(tel))) {
                alert("不是完整的11位手机号或者正确的手机号前7位!");
            } else {
                if (newPassword != repeatPassword) {
                    alert("两次密码不一致！");
                } else {
                    var obj = new Object();
                    obj.id = id;
                    obj.name = name;
                    obj.email = email;
                    obj.tel = tel;
                    obj.newPassword = newPassword;
                    obj.repeatPassword = repeatPassword;
                    $.ajax({
                        url: "/reset_password",
                        type: "POST",
                        cache: false,//设置不缓存
                        data: obj,
                        success: resetPasswordSuccess,
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
        }
    }
}

function resetPasswordSuccess(data) {
    if (data.indexOf("ok！") == 0) {
        alert("修改成功！");
        window.location.href = "/index.html";
    } else {
        alert(data);
    }
}

function gotoExperimentalReport() {
    releaseExperimentCharacteristic = false;
    gotoNodeManagementCharacteristic = false;
    gotoExperimentalReportCharacteristic = true;
    getUserInfo();
}

function gotoNodeManagement() {
    releaseExperimentCharacteristic = false;
    gotoExperimentalReportCharacteristic = false;
    gotoNodeManagementCharacteristic = true;
    getUserInfo();
}

$(document).ready(function () {
    $.ajax({
        url: "/get_user",
        type: "POST",
        cache: false,//设置不缓存
        success: getInitUserSuccess,
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
});

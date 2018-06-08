/**
 * Created by 郭欣光 on 2018/4/2.
 */

var userName = "";
var gotoExperimentalReportCharacteristic = false;
var gotoNodeManagementCharacteristic = false;
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
        window.location.href = "/index.html";
        // document.getElementById("checkCodeImage").src = "/get_check_code?imageId=" + Math.random();
        // document.getElementById("userLogin").click();
    } else {
        var user = JSON.parse(data);
        userName = user['name'];
        var role = user['role'];
        document.getElementById("myId").innerHTML = user['id'];
        document.getElementById("name").innerHTML = user['name'];
        document.getElementById("userName").value = user['name'];
        document.getElementById("sex").innerHTML = user['sex'];
        if (user['sex'].indexOf("男") == 0) {
            document.getElementById("userSexMan").click();
        } else {
            document.getElementById("userSexWoman").click();
        }
        document.getElementById("tel").innerHTML = user['tel'];
        document.getElementById("userTel").value = user['tel'];
        document.getElementById("email").innerHTML = user['email'];
        document.getElementById("userEmail").value = user['email'];
        document.title = user['name'] + " - 个人中心 - Cloud Lab";
        // var str = "<ul class='nav navbar-nav'>" +
        //     "<li class='dropdown'>" +
        //     "<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>" +
        //     "我的课程" +
        //     "</a>" +
        //     "<ul class='dropdown-menu'>" +
        //     "<li><a class='' href='#'>Linux基础入门新版</a></li>" +
        //     "<li><a class=''  href='#'>高级bash编程指南</a></li>" +
        //     "<li><a class=''  href='#'>java实现记事本</a></li>" +
        //     "<li><a class='' href='#' >python实现文字聊天室</a></li>" +
        //     "<li><a class=''  href='#'>查看更多</a></li>" +
        //     "</ul>" +
        //     "</li>" +
        //     "</ul>" +
        //     "<ul class='nav navbar-nav'>" +
        //     "<li class='dropdown'>" +
        //     "<a href='javascript:void(0);' class='dropdown-toggle' data-toggle='dropdown'>" +
        //     "欢迎您，" + userName +
        //     "</a>" +
        //     "<ul class='dropdown-menu'>" +
        //     "<li><a class='' href='#' >我的主页</a></li>" +
        //     "<li><a class='' href='#' >个人设置</a></li>" +
        //     "<li><a class='' href='#' onclick='javascript:signOut(); return false;' data-toggle='modal' data-target='#signOutModel'>退出登录</a></li>" +
        //     "</ul>" +
        //     "</li>" +
        //     "</ul>";
        // document.getElementById("userInfo").innerHTML = str;
        if(role.indexOf("教师") == 0) {
            // window.location.href = "/developer/index.html";
            teacherGetCoursesTop5();
        } else {
            // alert("抱歉，您的身份是：" + role + "  仅有教师可以查看实验报告！");
            // window.location.href = "/index.html";
        }
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
        setInterval(keepUserConnection, 10000);
        // getVNCNode();
        // document.getElementById("closeLogin").click();
    }
    return false;
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

function releaseExperiment() {
    $.ajax({
        url: "/get_user",
        type: "POST",
        cache: false,//设置不缓存
        success: checkUserSuccess,
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

function checkUserSuccess(data) {
    if(data.indexOf("error:") != -1) {
        getUserInfo();
    } else {
        var user = JSON.parse(data);
        var role = user['role'];
        if(role.indexOf("教师") == 0) {
            window.location.href = "/developer/index.html";
        } else {
            alert("抱歉，您的身份是：" + role + "  仅有教师可以发布实验！");
        }
    }
    return false;
}

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

function keepUserConnectionSuccess(data) {
    if(data.indexOf("error") == 0) {
        var str = "<a class=\"btn btn-default navbar-btn sign-in\" data-sign=\"signin\" href=\"#sign-modal\" data-toggle=\"modal\" id=\"userLogin\">登录</a>" +
            "<a class=\"btn btn-default navbar-btn sign-up\" data-sign=\"signup\" href=\"#sign-modal\" data-toggle=\"modal\">注册</a>";
        document.getElementById("userInfo").innerHTML = str;
    }
    console.log(data);
}

function gotoLink(path) {
    window.location.href = path;
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
    gotoNodeManagementCharacteristic = false;
    gotoExperimentalReportCharacteristic = true;
    getUserInfo();
}

function getMyCoursesTop5() {
    $.ajax({
        url: "/get_my_courses_top_5",
        type: "POST",
        cache: false,//设置不缓存
        success: getMyCoursesTop5Success,
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

function getMyCoursesTop5Success(data) {
    if(data.indexOf("没有用户！") == 0) {
        setTimeout("getMyCoursesTop5()", 500);
    } else {
        if(data.indexOf("没有课程！") == 0) {
            document.getElementById("myCourses").innerHTML = data;
        } else {
            var str = "";
            var courses = JSON.parse(data)['teacherCourses'];
            for(var i = 0; i < courses.length; i++) {
                var course = courses[i];
                str += "<a href=\"/developer/course_information.html?courseID=" + course['id'] + "\"><img style=\"width:25px;height:25px\" src=\"/user/course/img/" + course['img'] + "\"> " + course['name'] + "</a>";
            }
            if(courses.length == 5) {
                str += "<a href=\"/developer/index.html\">查看更多</a>";
            }
            document.getElementById("myCourses").innerHTML = str;
        }
    }
}

function changePassword() {
    document.getElementById("changePasswordHref").click();
}

function confirmChangePassword() {
    var oldPassword = document.getElementById("oldPassword").value;
    var newPassword = document.getElementById("newPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    if (oldPassword == null || oldPassword == "" || oldPassword.length == 0 || newPassword == null || newPassword == "" || newPassword.length == 0 || confirmPassword == null || confirmPassword == "" || confirmPassword.length == 0) {
        alert("所有字段不能为空！");
    } else {
        var obj = new Object();
        obj.oldPassword = oldPassword;
        obj.newPassword = newPassword;
        obj.confirmPassword = confirmPassword;
        $.ajax({
            url: "/change_password",
            type: "POST",
            cache: false,//设置不缓存
            data: obj,
            success: confirmChangePasswordSuccess,
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

function confirmChangePasswordSuccess(data) {
    if (data.indexOf("ok") == 0) {
        alert("修改成功！");
        window.location.href = window.location.href;
    } else {
        if (data.indexOf("没有用户！") == 0) {
            window.location.href  = "/index.html";
        } else {
            alert(data);
        }
    }
}

function changeUserInformation() {
    document.getElementById("changeUserInformationHref").click();
}

function changeUserInformationForm() {
    var userPassword = document.getElementById("userPassword").value;
    var userName = document.getElementById("userName").value;
    var userSex = "";
    if (document.getElementById("userSexMan").checked) {
        userSex = "男";
    } else {
        userSex = "女";
    }
    var userTel = document.getElementById("userTel").value;
    var userEmail = document.getElementById("userEmail").value;
    if (userPassword == null || userPassword == "" || userPassword.length == 0 || userName == null || userName == "" || userName.length == 0 || userTel == null || userTel == "" || userTel.length == 0 || userEmail == null || userEmail == "" || userEmail.length == 0) {
        alert ("所有字段不能为空！");
    } else {
        if (userName.length > 30) {
            alert("姓名长度大于30！");
        } else {
            if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(userTel))) {
                alert("不是完整的11位手机号或者正确的手机号前7位!");
            } else {
                if (userEmail.length > 50) {
                    alert("电子邮箱长度不能大于50！");
                } else {
                    if (!(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(userEmail))) {
                        alert("电子邮箱格式不正确！");
                    } else {
                        var obj = new Object();
                        obj.userPassword = userPassword;
                        obj.userName = userName;
                        obj.userSex = userSex;
                        obj.userTel = userTel;
                        obj.userEmail = userEmail;
                        $.ajax({
                            url: "/change_user_information",
                            type: "POST",
                            cache: false,//设置不缓存
                            data: obj,
                            success: changeUserInformationFormSuccess,
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
}

function changeUserInformationFormSuccess(data) {
    if (data.indexOf("没有用户！") == 0) {
        window.location.href = "/index.html";
    } else {
        if (data.indexOf("ok") == 0) {
            alert("修改成功！");
            window.location.reload();
        } else {
            alert(data);
        }
    }
}

function gotoNodeManagement() {
    gotoExperimentalReportCharacteristic = false;
    gotoNodeManagementCharacteristic = true;
    getUserInfo();
}

$(document).ready(function () {
    getUserInfo();
    getMyCoursesTop5();
});

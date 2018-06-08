/**
 * Created by 郭欣光 on 2018/3/14.
 */

function getCourseInfo() {
    if(window.location.href.indexOf("?") != -1) {
        if(window.location.href.split("?")[1].indexOf("=") != -1) {
            var courseID = window.location.href.split("?")[1].split("=")[1];
            var obj = new Object();
            obj.courseId = courseID;
            $.ajax({
                url: "/get_course_info",
                type: "POST",
                cache: false,//设置不缓存
                data: obj,
                success: getCourseInfoSuccess,
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
            alert("无法获得课程信息！");
            window.location.href = "/index.html";
        }
    } else {
        alert("无法获得课程信息！");
        window.location.href = "/index.html";
    }
}

function getCourseInfoSuccess(data) {
    if(data.indexOf("没有该课程！") == 0) {
        alert(data);
        window.location.href = "/index.html";
    } else {
        var course = JSON.parse(data);
        document.title = course['name'] + " - 实验环境 - Cloud Lab";
        document.getElementById("courseNameHref").innerHTML = "<a href=\"/developer/course_information.html?courseID=" + course['id'] + "\">" + course['name'] + "</a>";
        document.getElementById("courseEnvironmentHref").innerHTML = "<a href=\"/developer/experimental_environment.html?courseId=" + course['id'] + "\">" + course['name'] + "实验环境</a>";
        document.getElementById("courseName").innerHTML = course['name'];
        document.getElementById("editCourseName").value = course['name'];
        document.getElementById("courseDescription").innerHTML = course['description'];
        document.getElementById("editCourseDescribe").value = course['description'];
        var createTime = course['createTime'];
        var modificationTime = course['modificationTime'];
        createTime = createTime.split(".")[0];
        modificationTime = modificationTime.split(".")[0];
        document.getElementById("courseCreateTime").innerHTML = createTime;
        document.getElementById("courseModificationTime").innerHTML = modificationTime;
        document.getElementById("courseImg").src = "/user/course/img/" + course['img'];
        document.getElementById("courseImgMobile").src = "/user/course/img/" + course['img'];
        getCourseTeacherInfo(course['teacher']);
        getCoursesCount(course['teacher']);
    }
}

function getCourseTeacherInfo(teacherId) {
    var obj = new Object();
    obj.teacherId = teacherId;
    $.ajax({
        url: "/get_teacher_info",
        type: "POST",
        cache: false,//设置不缓存
        data: obj,
        success: getTeacherInfoSuccess,
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

function getTeacherInfoSuccess(data) {
    var teacher = JSON.parse(data);
    document.getElementById("courseTeacher").innerHTML = teacher['name'];
}

function getCoursesCount(teacherId) {
    var obj = new Object();
    obj.teacherId = teacherId;
    $.ajax({
        url: "/get_teacher_courses_count",
        type: "POST",
        cache: false,//设置不缓存
        data: obj,
        success: getCoursesCountSuccess,
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

function getCoursesCountSuccess(data) {
    document.getElementById("coursesCount").innerHTML = data;
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
            document.getElementById("myCoursesTop5").innerHTML = data;
        } else {
            var str = "";
            var courses = JSON.parse(data)['teacherCourses'];
            for(var i = 0; i < courses.length; i++) {
                var course = courses[i];
                str += "<a href=\"/developer/course_information.html?courseID=" + course['id'] + "\">" + course['name'] + "</a>";
            }
            if(courses.length == 5) {
                str += "<a href=\"/developer/index.html\">查看更多</a>";
            }
            document.getElementById("myCoursesTop5").innerHTML = str;
        }
    }
}

function editCourseInfo() {
    document.getElementById("editCourse").click();
}

function editCourseInformationConfirm() {
    var courseName = document.getElementById("editCourseName").value;
    var courseDescription = document.getElementById("editCourseDescribe").value;
    if(courseName == null || courseName == "") {
        alert("课程名称不能为空！");
        $("#editCourseName").focus();
    } else {
        if(courseDescription == null || courseDescription == "") {
            alert("课程描述不能为空！");
            $("editCourseDescribe").focus();
        } else {
            if(courseName.length > 200) {
                alert("课程名称不能超过200字符！");
                $("#editCourseName").focus();
            } else {
                if(courseDescription.length > 800) {
                    alert("课程描述不能超过800字符！");
                    $("editCourseDescribe").focus();
                } else {
                    if(window.location.href.indexOf("?") != -1) {
                        if(window.location.href.split("?")[1].indexOf("=") != -1) {
                            var courseId = window.location.href.split("?")[1].split("=")[1];
                            var obj = new Object();
                            obj.courseId = courseId;
                            obj.courseName = courseName;
                            obj.courseDescription = courseDescription;
                            $.ajax({
                                url: "/edit_course_information",
                                type: "POST",
                                cache: false,//设置不缓存
                                data: obj,
                                success: editCourseInformationConfirmSuccess,
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
                            alert("不能正确获得课程编号，确保系统生成的url没有变动！");
                        }
                    } else {
                        alert("不能正确获得课程编号，确保系统生成的url没有变动！");
                    }
                }
            }
        }
    }
}

function editCourseInformationConfirmSuccess(data) {
    if(data.indexOf("ok") == 0) {
        alert("修改成功！");
        window.location.href = window.location.href;
    } else {
        alert(data);
    }
}

function deleteCourse() {
    if(confirm("确定删除课程？该操作将删除课程内所有的实验！")) {
        if(window.location.href.indexOf("?") != -1) {
            if(window.location.href.split("?")[1].indexOf("=") != -1) {
                var courseId = window.location.href.split("?")[1].split("=")[1];
                var obj = new Object();
                obj.courseId= courseId;
                $.ajax({
                    url: "/delete_course",
                    type: "POST",
                    cache: false,//设置不缓存
                    data: obj,
                    success: deleteCourseSuccess,
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
                alert("不能正确获得课程编号，确保系统生成的url没有变动！");
            }
        } else {
            alert("不能正确获得课程编号，确保系统生成的url没有变动！");
        }
    }
}

function deleteCourseSuccess(data) {
    if(data.indexOf("ok") == 0) {
        alert("删除成功！");
        window.location.href = "/developer/index.html";
    } else {
        if(data.indexOf("没有该课程编号的课程，可能系统生成的url发生改动，或课程已经被删除！") == 0) {
            alert(data);
            window.location.href = "/developer/index.html";
        } else {
            alert(data);
        }
    }
}

/**
 * 打开上传实验环境的界面
 */
function uploadExperimentalEnvironment() {
    if(window.location.href.indexOf("?") != -1) {
        if(window.location.href.split("?")[1].indexOf("=") != -1) {
            var courseId = window.location.href.split("?")[1].split("=")[1];
            document.getElementById("courseId").value = courseId;
            document.getElementById("uploadExperimentalEnvironmentHref").click();
        } else {
            alert("找不到课程信息！");
            window.location.href = "/developer/index.html";
        }
    } else {
        alert("找不到课程信息！");
        window.location.href = "/developer/index.html";
    }
}

function uploadExperimentalEnverimentForm() {
    var formData = new FormData($('#experimentalEnvironmentForm')[0]);
    $.ajax({
        type: "POST",
        url: "/upload_experimental_environment",
        // async: false,//true表示同步，false表示异步
        cache: false,//设置不缓存
        data: formData,
        contentType: false,//必须设置false才会自动加上正确的Content-Tyoe
        processData: false,//必须设置false才避开jquery对formdata的默认处理，XMLHttpRequest会对formdata进行正确的处理
        success: function (data) {
            alert(data);
            if(data.indexOf("没有用户！") == 0) {
                window.location.href = "/index.html";
            } else {
                if(data.indexOf("没有该课程！") == 0) {
                    window.location.href = "/developer/index.html";
                } else {
                    if(data.indexOf("上传成功！") == 0) {
                        window.location.href = window.location.href;
                    } else {
                        if(data.indexOf("您的身份是") == 0) {
                            window.location.href = "/index.html";
                        }
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

function getCourseExperimentalEnvironment() {
    var courseId = window.location.href.split("?")[1].split("=")[1];
    var obj = new Object();
    obj.courseId = courseId;
    $.ajax({
        url: "/get_course_experimental_environment",
        type: "POST",
        cache: false,//设置不缓存
        data: obj,
        success: getCourseExperimentalEnvironmentSuccess,
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

function getCourseExperimentalEnvironmentSuccess(data) {
    if(data.indexOf("该课程暂没有上传实验环境！") == 0) {
        document.getElementById("labs").innerHTML = data;
    } else {
        if(data.indexOf("没有该课程！") != -1) {
            alert(data);
            window.location.href = "/developer/index.html";
        } else {
            var str = "";
            var obj = JSON.parse(data);
            var experimentalEnvironmentList = obj.experimentalEnvironmentList;
            for (var i = 0; i < experimentalEnvironmentList.length; i++) {
                str += "<div class=\"lab-item \">";
                str += "<div class=\"lab-item-title\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"" + experimentalEnvironmentList[i].name + "\">" + experimentalEnvironmentList[i].name + "</div>";
                str += "<div class=\"pull-right lab-item-ctrl\">";
                str += experimentalEnvironmentList[i].size.toFixed(3) + "KB/" + experimentalEnvironmentList[i].status;
                str += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                str += "<a class=\"btn btn-info\" onclick=\"sendExperimentalEnvironment('" + experimentalEnvironmentList[i].id + "')\">发送</a>";
                str += "&nbsp;&nbsp;";
                str += "<a class=\"btn btn-danger\" onclick=\"deleteExperimentalEnvironment('" + experimentalEnvironmentList[i].id + "')\">删除</a>";
                str += "</div>";
                str += "</div>";
            }
            document.getElementById("labs").innerHTML = str;
        }
    }
}

function sendExperimentalEnvironment(experimentalEnvironmentId) {
    document.getElementById("sendExperimentalEnvironmentInfoHref").click();
    var obj = new Object();
    obj.experimentalEnvironmentId = experimentalEnvironmentId;
    $.ajax({
        url: "/send_experimental_environment",
        type: "POST",
        cache: false,//设置不缓存
        data: obj,
        success: sendExperimentalEnvironmentSuccess,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            document.getElementById("sendExperimentalEnvironmentInfo").click();
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

function sendExperimentalEnvironmentSuccess(data) {
    document.getElementById("sendExperimentalEnvironmentInfo").click();
    if(data.indexOf("ok") == 0) {
        alert("发送成功！");
        window.location.href = window.location.href;
    } else {
        if(data.indexOf("没有用户！") == 0) {
            window.location.href = "/index.html";
        } else {
            alert(data);
            if(data.indexOf("抱歉，您的身份是") == 0) {
                window.location.href = "/index.html";
            } else {
                if(data.indexOf("没有该实验环境！") == 0) {
                    window.location.href = window.location.href;
                }
            }
        }
    }
}

function deleteExperimentalEnvironment(experimentalEnvironmentId) {
    var obj = new Object();
    obj.experimentalEnvironmentId = experimentalEnvironmentId;
    $.ajax({
        url: "/delete_experimental_environment",
        type: "POST",
        cache: false,//设置不缓存
        data: obj,
        success: deleteExperimentalEnvironmentSuccess,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            document.getElementById("sendExperimentalEnvironmentInfo").click();
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

function deleteExperimentalEnvironmentSuccess(data) {
    if(data.indexOf("ok") == 0) {
        alert("删除成功！");
        window.location.href = window.location.href;
    } else {
        if (data.indexOf("没有用户！") == 0) {
            window.location.href = "/index.html";
        } else {
            alert(data);
            if (data.indexOf("抱歉，您的身份是") == 0) {
                window.location.href = "/index.html";
            }
        }
    }
}

$(document).ready(function () {
    getCourseInfo();
    getMyCoursesTop5();
    getCourseExperimentalEnvironment();
});

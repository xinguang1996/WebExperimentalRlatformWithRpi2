/**
 * Created by 郭欣光 on 2018/3/30.
 */

function getCourseInformation() {
    if(window.location.href.indexOf("?") != -1) {
        if(window.location.href.split("?")[1].indexOf("=") != -1) {
            var courseId = window.location.href.split("?")[1].split("=")[1];
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
            alert("不能找到课程信息，请确保系统生成的url正确！");
            window.location.href = "/experimental_report/index.html";
        }
    } else {
        alert("不能找到课程信息，请确保系统生成的url正确！");
        window.location.href = "/experimental_report/index.html";
    }
}

function getCourseInformationSuccess(data) {
    if (data.indexOf("没有该课程！") == 0) {
        alert(data);
        window.location.href = "/experimental_report/index.html";
    } else {
        var course = JSON.parse(data);
        document.title = course['name'] + " - 实验报告 - Cloud Lab";
        // document.getElementById("courseTab").innerHTML = "<a href=\"/courses/index.html?tag=" + course['tab'] + "&page=1\">" + course['tab'] + "</a>";
        document.getElementById("courseNameHref").innerHTML = "<a href=\"/experimental_report/show.html?courseId=" + course['id'] + "\">" + course['name'] + "</a>";
        document.getElementById("courseName").innerHTML = course['name'];
        document.getElementById("courseDescription").innerHTML = course['description'];
        var createTime = course['createTime'];
        var modificationTime = course['modificationTime'];
        createTime = createTime.split(".")[0];
        modificationTime = modificationTime.split(".")[0];
        document.getElementById("courseCreateTime").innerHTML = createTime;
        document.getElementById("courseModificationTime").innerHTML = modificationTime;
        document.getElementById("courseImg").src = "/user/course/img/" + course['img'];
        document.getElementById("courseImgMobile").src = "/user/course/img/" + course['img'];
        document.getElementById("teacherCoursesUrl").href = "/experimental_report/index.html";
        getCourseTeacherInformation(course['teacher']);
        getCoursesCount(course['teacher']);
    }
}

function getCourseExperimental() {
    if(window.location.href.indexOf("?") != -1) {
        if(window.location.href.split("?")[1].indexOf("=") != -1) {
            var courseId = window.location.href.split("?")[1].split("=")[1];
            var obj = new Object();
            obj.courseId = courseId;
            $.ajax({
                url: "/get_course_experimental",
                type: "POST",
                cache: false,//设置不缓存
                data: obj,
                success: getCourseExperimentalSuccess,
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
            alert("不能找到课程信息，请确保系统生成的url正确！");
            window.location.href = "/experimental_report/index.html";
        }
    } else {
        alert("不能找到课程信息，请确保系统生成的url正确！");
        window.location.href = "/experimental_report/index.html";
    }
}

function getCourseExperimentalSuccess(data) {
    if(data.indexOf("该课程暂时没有实验内容！") == 0) {
        document.getElementById("labs").innerHTML = data;
    } else {
        var str = "";
        var obj = JSON.parse(data);
        var experimentalDocumentList = obj.experimentalDocument;
        for(var i = 0; i < experimentalDocumentList.length; i++) {
            str += "<div class=\"lab-item \">";
            str += "<div class=\"lab-item-title\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"" + experimentalDocumentList[i].title + "\">" + experimentalDocumentList[i].title + "</div>";
            str += "<div class=\"pull-right lab-item-ctrl\">";
            // str += "<a class=\"btn btn-default\" href=\"/courses/show_experimental_information.html?coursesId=" + experimentalDocumentList[i].courseId + "&experimentalId=" + experimentalDocumentList[i].id + "\" >查看文档</a>";
            str += "<a class=\"btn btn-primary\" href=\"/experimental_report/show_experimental_report.html?courseId=" + experimentalDocumentList[i].courseId + "&experimentalId=" + experimentalDocumentList[i].id + "&page=1\">实验报告</a>";
            // str += "<a class=\"btn btn-info\" onclick=\"javascript:uploadExperimentalReport('" + experimentalDocumentList[i].id + "'); return false;\" >实验报告</a>";
            str += "</div>";
            str += "</div>";
        }
        document.getElementById("labs").innerHTML = str;
    }
}

function getCourseTeacherInformation(teacherId) {
    var obj = new Object();
    obj.teacherId = teacherId;
    $.ajax({
        url: "/get_teacher_info",
        type: "POST",
        cache: false,//设置不缓存
        data: obj,
        success: getCourseTeacherInformationSuccess,
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

function getCourseTeacherInformationSuccess(data) {
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

function getOtherCourses() {
    $.ajax({
        url: "/get_courses_top5",
        type: "POST",
        cache: false,//设置不缓存
        success: getOtherCoursesSuccess,
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

function getOtherCoursesSuccess(data) {
    if(data.indexOf("暂无课程！") == 0) {
        document.getElementById("otherCourses").innerHTML = data;
    } else {
        var coursesJson = JSON.parse(data);
        var courseList = coursesJson['courseList'];
        var str = "";
        for(var i = 0; i < courseList.length; i++) {
            str += "<a href=\"/experimental_report/show.html?courseId=" + courseList[i].id + "\">" + courseList[i].name + "</a>";
        }
        document.getElementById("otherCourses").innerHTML = str;
    }
}

$(document).ready(function () {
    getCourseInformation();
    getCourseExperimental();
    getOtherCourses();
});

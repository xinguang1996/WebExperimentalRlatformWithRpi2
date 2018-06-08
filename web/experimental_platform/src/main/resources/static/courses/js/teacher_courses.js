/**
 * Created by 郭欣光 on 2018/3/18.
 */
var page = 1;
var teacherId = "";

function showCourses() {
    // var teacherId;
    if(window.location.href.indexOf("?") != -1) {
        if(window.location.href.split("?")[1].indexOf("&") != -1) {
            if(window.location.href.split("?")[1].split("&")[0].indexOf("=") != -1) {
                teacherId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
                if(window.location.href.split("?")[1].split("&")[1].indexOf("=") != -1) {
                    page = window.location.href.split("?")[1].split("&")[1].split("=")[1];
                }
            } else {
                alert("无法获得教师信息！");
                window.location.href = "/courses/index.html";
            }
        } else {
            if(window.location.href.split("?")[1].indexOf("=") != -1) {
                teacherId = window.location.href.split("?")[1].split("=")[1];
            } else {
                alert("无法获得教师信息！");
                window.location.href = "/courses/index.html";
            }
        }
    } else {
        alert("无法获得教师信息！");
        window.location.href = "/courses/index.html";
    }
    getTeacherInformation(teacherId);
    var obj = new Object();
    obj.teacherId = teacherId;
    obj.page = page;
    $.ajax({
        url: "/get_teacher_courses",
        type: "POST",
        cache: false,//设置不缓存
        data: obj,
        success: showCoursesSuccess,
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

function showCoursesSuccess(data) {
    if (data.indexOf("没有该教师！") == 0 || data.indexOf("页数无法转换为整数！") == 0) {
        alert(data);
        window.location.href = "/courses/index.html";
    } else {
        if (data.indexOf("超出页数！") == 0) {
            window.location.href = "/courses/teacher_courses.html?teacherId=" + teacherId + "&page=" + 1;
        } else {
            if (data.indexOf("暂没有课程内容！") == 0) {
                document.getElementById("coursesInformation").innerHTML = data;
                document.getElementById("pageNow").innerHTML = "&nbsp;&nbsp;1/1&nbsp;&nbsp;";
                document.getElementById("previousPage").className = "previous disabled";
                document.getElementById("previousPageHref").href = "javascript:void(0)";
                document.getElementById("previousNext").className = "next disabled";
                document.getElementById("previousNextHref").href = "javascript:void(0)";
            } else {
                var obj = JSON.parse(data);
                var courseList = obj['courseList'];
                var pageCount = obj['pageCount'];
                var str = "";
                for(var i = 0; i < courseList.length; i ++) {
                    str += "<div class=\"col-md-4 col-sm-6  course\">";
                    str += "<a class=\"course-box\" href=\"/courses/show.html?courseId=" + courseList[i].id + "\">";
                    str += "<div class=\"sign-box\">";
                    str += "<i class=\"fa fa-star-o course-follow pull-right\"";
                    str += " data-follow-url=\"/courses/63/follow\"";
                    str += " data-unfollow-url=\"/courses/63/unfollow\"  style=\"display:none\"  ></i>";
                    str += "</div>";
                    str += "<div class=\"course-img\">";
                    str += "<img alt=\"" + courseList[i].name + "\" src=\"/user/course/img/" + courseList[i].img + "\">";
                    str += "</div>";
                    str += "<div class=\"course-body\">";
                    str += "<span class=\"course-title\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"" + courseList[i].name + "\">" + courseList[i].name + "</span>";
                    str += "</div>";
                    str += "<div class=\"course-footer\">";
                    str += "<span class=\"course-per-num pull-left\">";
                    str += "最近修改于：" + courseList[i].modificationTime.split(".")[0];
                    str += "</span>";
                    str += "</div>";
                    str += "</a>";
                    str += "</div>";
                }
                document.getElementById("coursesInformation").innerHTML = str;
                document.getElementById("pageNow").innerHTML = "&nbsp;&nbsp;" + page + "/" + pageCount + "&nbsp;&nbsp;";
                if(page == 1) {
                    document.getElementById("previousPage").className = "previous disabled";
                    document.getElementById("previousPageHref").href = "javascript:void(0)";
                } else {
                    document.getElementById("previousPage").className = "previous";
                    document.getElementById("previousPageHref").href = "/courses/teacher_courses.html?teacherId=" + teacherId + "&page=" + (page - 1);
                }
                if(page == pageCount) {
                    document.getElementById("previousNext").className = "next disabled";
                    document.getElementById("previousNextHref").href = "javascript:void(0)";
                } else {
                    document.getElementById("previousNext").className = "next";
                    document.getElementById("previousNextHref").href = "/courses/teacher_courses.html?teacherId=" + teacherId + "&page=" + (page + 1);
                }
            }
        }
    }
}

function getTeacherInformation(teacherId) {
    var obj = new Object();
    obj.teacherId = teacherId;
    $.ajax({
        url: "/get_teacher_info",
        type: "POST",
        cache: false,//设置不缓存
        data: obj,
        success: getTeacherInformationSuccess,
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

function getTeacherInformationSuccess(data) {
    var teacher = JSON.parse(data);
    document.getElementById("teacherNameCourse").innerHTML = teacher['name'] + "老师的课程列表";
    document.title = teacher['name'] + " - 课程 - Cloud Lab";
}

$(document).ready(function () {
   showCourses();
});

/**
 * Created by 郭欣光 on 2018/1/7.
 */
var page = 1;
function getMyCourses() {
    if (window.location.href.indexOf("?") != -1) {
        if (window.location.href.split("?")[1].indexOf("=") != -1) {
            page = window.location.href.split("?")[1].split("=")[1];
        }
    }
    var obj = new Object();
    obj.page = page;
    $.ajax({
        url: "/get_my_courses",
        type: "POST",
        cache: false,//设置不缓存
        data: obj,
        success: getMyCoursesSuccess,
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

function getMyCoursesSuccess(data) {
    if(data.indexOf("没有用户！") == 0) {
        setTimeout("getMyCourses()", 500);
    } else {
        if(data.indexOf("您的身份是学生，仅有教师可以编写实验！") == 0) {
            // alert(data);
            window.location.href = "/index.html";
        } else {
            if(data.indexOf("暂无课程！") == 0) {
                // alert(data);
                document.getElementById("myCourses").innerHTML = data;
                document.getElementById("pageNow").innerHTML = "&nbsp;&nbsp;1/1&nbsp;&nbsp;";
                document.getElementById("previousPage").className = "previous disabled";
                document.getElementById("previousPageHref").href = "javascript:void(0)";
                document.getElementById("previousNext").className = "next disabled";
                document.getElementById("previousNextHref").href = "javascript:void(0)";
            } else {
                if (data.indexOf("页数出错！") == 0) {
                    window.location.href = "/developer/index.html";
                } else {
                    if (data.indexOf("超出页数！") == 0) {
                        alert(data);
                        window.location.href = "/developer/index.html";
                    } else {
                        var str = "";
                        var coursesJson = JSON.parse(data);
                        var coursesArray = coursesJson['courseList'];
                        var pageCount = coursesJson['pageCount'];
                        for (var i = 0; i < coursesArray.length; i++) {
                            var course = coursesArray[i];
                            var description = course['description'];
                            if (description.length > 10) {
                                description = description.substring(0, 10);
                                description = description + "...";
                            }
                            str += "<div class=\"col-md-4\">\n";
                            str += " <a class=\"media\" href=\"/developer/course_information.html?courseID=" + course['id'] + "\" target=\"_blank\">\n";
                            str += "<div class=\"media-left\">\n";
                            str += "<img class=\"media-object\" src=\"/user/course/img/" + course['img'] + "\">\n";
                            str += "</div>";
                            str += "<div class=\"media-body\">\n";
                            str += "<p>" + course['name'] + "</p>\n";
                            str += "<h4>" + description + "</h4>\n";
                            str += "</div>\n";
                            str += "</a>\n";
                            str += "</div>\n";
                            str += "\n";
                        }
                        document.getElementById("myCourses").innerHTML = str;
                        document.getElementById("pageNow").innerHTML = "&nbsp;&nbsp;" + page + "/" + pageCount + "&nbsp;&nbsp;";
                        if(page == 1) {
                            document.getElementById("previousPage").className = "previous disabled";
                            document.getElementById("previousPageHref").href = "javascript:void(0)";
                        } else {
                            document.getElementById("previousPage").className = "previous";
                            document.getElementById("previousPageHref").href = "/developer/index.html?page=" + (page - 1);
                        }
                        if(page == pageCount) {
                            document.getElementById("previousNext").className = "next disabled";
                            document.getElementById("previousNextHref").href = "javascript:void(0)";
                        } else {
                            document.getElementById("previousNext").className = "next";
                            document.getElementById("previousNextHref").href = "/developer/index.html?page=" + (page + 1);
                        }
                    }
                }
            }
        }
    }
}

$(document).ready(function () {
    getMyCourses();
});

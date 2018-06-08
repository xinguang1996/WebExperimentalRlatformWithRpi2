/**
 * Created by 郭欣光 on 2018/3/28.
 */

var page = 1;

function showCourses() {
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
    if(data.indexOf("没有用户！") == 0) {
        window.location.href = "/index.html";
    } else {
        if(data.indexOf("您的身份是学生，仅有教师可以编写实验！") == 0) {
            // alert(data);
            window.location.href = "/index.html";
        } else {
            if(data.indexOf("暂无课程！") == 0) {
                // alert(data);
                document.getElementById("coursesInformation").innerHTML = data;
                document.getElementById("pageNow").innerHTML = "&nbsp;&nbsp;1/1&nbsp;&nbsp;";
                document.getElementById("previousPage").className = "previous disabled";
                document.getElementById("previousPageHref").href = "javascript:void(0)";
                document.getElementById("previousNext").className = "next disabled";
                document.getElementById("previousNextHref").href = "javascript:void(0)";
            } else {
                if (data.indexOf("页数出错！") == 0) {
                    window.location.href = "/experimental_report/index.html";
                } else {
                    if (data.indexOf("超出页数！") == 0) {
                        alert(data);
                        window.location.href = "/experimental_report/index.html";
                    } else {
                        var str = "";
                        var coursesJson = JSON.parse(data);
                        var coursesArray = coursesJson['courseList'];
                        var pageCount = coursesJson['pageCount'];
                        for(var i = 0; i < coursesArray.length; i ++) {
                            str += "<div class=\"col-md-4 col-sm-6  course\">";
                            str += "<a class=\"course-box\" href=\"/experimental_report/show.html?courseId=" + coursesArray[i].id + "\">";
                            str += "<div class=\"sign-box\">";
                            str += "<i class=\"fa fa-star-o course-follow pull-right\"";
                            str += " data-follow-url=\"/courses/63/follow\"";
                            str += " data-unfollow-url=\"/courses/63/unfollow\"  style=\"display:none\"  ></i>";
                            str += "</div>";
                            str += "<div class=\"course-img\">";
                            str += "<img alt=\"" + coursesArray[i].name + "\" src=\"/user/course/img/" + coursesArray[i].img + "\">";
                            str += "</div>";
                            str += "<div class=\"course-body\">";
                            str += "<span class=\"course-title\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"" + coursesArray[i].name + "\">" + coursesArray[i].name + "</span>";
                            str += "</div>";
                            str += "<div class=\"course-footer\">";
                            str += "<span class=\"course-per-num pull-left\">";
                            str += "最近修改于：" + coursesArray[i].modificationTime.split(".")[0];
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
                            document.getElementById("previousPageHref").href = "/experimental_report/index.html?page=" + (page - 1);
                        }
                        if(page == pageCount) {
                            document.getElementById("previousNext").className = "next disabled";
                            document.getElementById("previousNextHref").href = "javascript:void(0)";
                        } else {
                            document.getElementById("previousNext").className = "next";
                            document.getElementById("previousNextHref").href = "/experimental_report/index.html?page=" + (page + 1);
                        }
                    }
                }
            }
        }
    }
}

$(document).ready(function () {
    showCourses();
});
/**
 * Created by 郭欣光 on 2018/4/1.
 */

function getCourseInfo() {
    try {
        var courseId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
        var obj = new Object();
        obj.courseId = courseId;
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
    } catch (err) {
        alert("无法获得课程信息！");
        window.location.href = "/experimental_report/index.html";
    }
}

function getCourseInfoSuccess(data) {
    if(data.indexOf("没有该课程！") == 0) {
        alert(data);
        window.location.href = "/experimental_report/index.html";
    } else {
        var course = JSON.parse(data);
        // document.getElementById("courseTab").innerHTML = "<a href=\"/courses/index.html?tag=" + course['tab'] + "&page=1\">" + course['tab'] + "</a>";
        document.getElementById("courseURL").innerHTML = "<a href=\"/experimental_report/show.html?courseId=" + course['id'] + "\">" + course['name'] + "</a>";
        // document.getElementById("courseURL").href = "/courses/show.html?courseId=" + course['id'];
        // document.getElementById("courseURL").innerHTML = course['name'];
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

function getExperimentalInformation() {
    try {
        var experimentalId = window.location.href.split("?")[1].split("&")[1].split("=")[1];
        var obj = new Object();
        obj.experimentalId = experimentalId;
        $.ajax({
            url: "/get_experimental_information",
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
    } catch (err) {
        alert("不能找到实验信息，请确保系统生成的url正确！");
        window.location.href = "/experimental_report/index.html";
    }
}

function getExperimentalInformationSuccess(data) {
    if(data.indexOf("error:") == 0) {
        alert(data.split("error:")[1]);
        window.location.href = "/experimental_report/index.html";
    } else {
        var experimentalInformation = JSON.parse(data);
        // document.title = experimentalInformation['title'] + " - 实验报告 - Cloud Lab";
        try {
            var courseId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
            var experimentalId = window.location.href.split("?")[1].split("&")[1].split("=")[1];
            document.getElementById("experimentalNameHref").innerHTML = "<a href=\"/experimental_report/show_experimental_report.html?courseId=" + courseId + "&experimentalId=" + experimentalId + "&page=1\">" + experimentalInformation['title'] + "</a>";
        } catch (err) {
            alert("不能找到课程和实验信息，请确保系统生成的url正确！");
            window.location.href = "/experimental_report/index.html";
        }
        // if(experimentalInformation['content'].indexOf("pdf") == 0) {
        //     var windowHeight = window.screen.availHeight;
        //     var str = "<iframe id = \"experimentalDoc\" name=\"experimentalDoc\" frameborder=\"0\" src=\"" + experimentalInformation['experimentalUrl'] + "?experimentalNoCache=" + Math.random() + "\" height=\"" + (0.55 * windowHeight) + "px\" width=\"100%\" ></iframe>";
        //     document.getElementById("labs").innerHTML = str;
        // } else {
        //     document.getElementById("labs").innerHTML = experimentalInformation['content'];
        // }
    }
}

function getExperimentalReportTop5() {
    try {
        var experimentalId = window.location.href.split("?")[1].split("&")[1].split("=")[1];
        var obj = new Object();
        obj.experimentalId = experimentalId;
        $.ajax({
            url: "/get_experimental_report_top5",
            type: "POST",
            cache: false,//设置不缓存
            data: obj,
            success: getExperimentalReportTop5Success,
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
    } catch (err) {
        alert("不能找到实验信息，请确保系统生成的url正确！");
        window.location.href = "/experimental_report/index.html";
    }
}

function getExperimentalReportTop5Success(data) {
    if (data.indexOf("没有该实验！") == 0) {
        alert(data);
        try {
            var courseId  = window.location.href.split("?")[1].split("&")[0].split("=")[1];
            window.location.href = "/experimental_report/show.html?courseId=" + courseId;
        } catch (err) {
            window.location.href = "/experimental_report/index.html";
        }
    } else {
        if (data.indexOf("暂无实验报告！") == 0) {
            document.getElementById("experimentalReportList").innerHTML = data;
        } else {
            try {
                var courseId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
                // var experimentalId = window.location.href.split("?")[1].split("&")[1].split("=")[1];
                var obj = JSON.parse(data);
                var experimentalReportList = obj['experimentalReportList'];
                var str = "";
                for (var i = 0; i < experimentalReportList.length; i++) {
                    str += "<a href=\"/experimental_report/show_experimental_report_information.html?courseId=" + courseId + "&experimentalId=" + experimentalReportList[i].experimentalId + "&experimentalReportId=" + experimentalReportList[i].id + "\">" + experimentalReportList[i].title + "</a>";
                }
                if (experimentalReportList.length >= 5) {
                    str += "<a href=\"/experimental_report/show_experimental_report.html?courseId=" +courseId + "&experimentalId=" + experimentalReportList[0].experimentalId + "&page=1\">查看更多</a>";
                }
                document.getElementById("experimentalReportList").innerHTML = str;
            } catch (err) {
                alert("不能找到课程信息，请确保系统生成的url正确！");
                window.location.href = "/experimental_report/index.html";
            }
        }
    }
}

function getExperimentalReportInformation() {
    try {
        var experimentalReportId = window.location.href.split("?")[1].split("&")[2].split("=")[1];
        var obj = new Object();
        obj.experimentalReportId = experimentalReportId;
        $.ajax({
            url: "/get_experimental_report_information",
            type: "POST",
            cache: false,//设置不缓存
            data: obj,
            success: getExperimentalReportInformationSuccess,
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
    } catch (err) {
        alert("无法获得实验报告信息，请确认系统生成的url是否正确！");
        window.location.href = "/experimental_report/index.html";
    }
}

function getExperimentalReportInformationSuccess(data) {
    if (data.indexOf("没有用户！") == 0) {
        setTimeout("getExperimentalReportInformation();", 500);
    } else {
        if (data.indexOf("抱歉，您的身份是") == 0) {
            alert(data);
            window.location.href = "/index.html";
        } else {
            if (data.indexOf("没有该实验报告！") == 0) {
                alert(data);
                try {
                    var courseId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
                    var experimentalId = window.location.href.split("?")[1].split("&")[1].split("=")[1];
                    window.location.href = "/experimental_report/show_experimental_report.html?courseId=" + courseId + "&experimentalId=" + experimentalId + "&page=1";
                } catch (err) {
                    alert("无法获取课程和实验信息，请确认系统生成的url是否正确！");
                    window.location.href  = "/experimental_report/index.html";
                }
            } else {
                var obj = JSON.parse(data);
                var experimentalReportStr = obj['experimentalReport'];
                var experimentalReport = JSON.parse(experimentalReportStr);
                var experimentalReportSrc = obj['experimentalReportSrc'];
                document.title = experimentalReport['title'] + " - 实验报告 - Cloud Lab";
                try {
                    var courseId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
                    document.getElementById("experimentalReportNameHref").innerHTML = "<a href=\"/experimental_report/show_experimental_report_information.html?courseId=" + courseId + "&experimentalId=" + experimentalReport.experimentalId + "&experimentalReportId=" + experimentalReport.id + "\">" + experimentalReport.title + "</a>";
                } catch (err) {
                    alert("无法获得课程信息，请确认系统生成的url是否正确！");
                    window.location.href = "/experimental_report/index.html";
                }
                document.getElementById("experimentalReportTitle").innerHTML = experimentalReport.title;
                var windowHeight = window.screen.availHeight;
                var str = "<iframe id = \"experimentalReportDoc\" name=\"experimentalReportDoc\" frameborder=\"0\" src=\"" + experimentalReportSrc + "?experimentalNoCache=" + Math.random() + "\" height=\"" + (0.55 * windowHeight) + "px\" width=\"100%\" ></iframe>";
                document.getElementById("labs").innerHTML = str;
            }
        }
    }
}

$(document).ready(function () {
    getCourseInfo();
    getExperimentalInformation();
    getExperimentalReportTop5();
    getExperimentalReportInformation();
});

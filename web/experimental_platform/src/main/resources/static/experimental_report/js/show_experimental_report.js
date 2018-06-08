/**
 * Created by 郭欣光 on 2018/3/31.
 */

var page = 1;

function getCourseInformation() {
    if(window.location.href.indexOf("?") != -1) {
        if(window.location.href.split("?")[1].indexOf("&") != -1) {
            if (window.location.href.split("?")[1].split("&")[0].indexOf("=") != -1) {
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
                alert("不能找到课程信息，请确保系统生成的url正确！");
                window.location.href = "/experimental_report/index.html";
            }
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
        // document.title = course['name'] + " - 实验报告 - Cloud Lab";
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

function getCourseExperimentalTop5() {
    if (window.location.href.indexOf("?") != -1) {
        if (window.location.href.split("?")[1].indexOf("&") != -1) {
            if (window.location.href.split("?")[1].split("&")[0].indexOf("=") != -1) {
                var courseId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
                var obj = new Object();
                obj.courseId = courseId;
                $.ajax({
                    url: "/get_course_experimental_top5",
                    type: "POST",
                    cache: false,//设置不缓存
                    data: obj,
                    success: getCourseExperimentalTop5Success,
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
    } else {
        alert("不能找到课程信息，请确保系统生成的url正确！");
        window.location.href = "/experimental_report/index.html";
    }
}

function getCourseExperimentalTop5Success(data) {
    if(data.indexOf("该课程暂时没有实验内容！") == 0) {
        document.getElementById("experimentalDocuments").innerHTML = data;
    } else {
        var str = "";
        var obj = JSON.parse(data);
        var experimentalDocumentList = obj.experimentalDocument;
        var courseId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
        for(var i = 0; i < experimentalDocumentList.length; i++) {
            str += "<a href=\"/experimental_report/show_experimental_report.html?courseId=" + experimentalDocumentList[i].courseId + "&experimentalId=" + experimentalDocumentList[i].id + "&page=1\">" + experimentalDocumentList[i].title + "</a>";
        }
        if(experimentalDocumentList.length >= 5) {
            str += "<a href=\"/experimental_report/show.html?courseId=" + experimentalDocumentList[0].courseId + "\">查看更多</a>";
        }
        document.getElementById("experimentalDocuments").innerHTML = str;
    }
}

function getExperimentalInformation() {
    if (window.location.href.indexOf("?") != -1) {
        if (window.location.href.split("?")[1].indexOf("&") != -1) {
            if (window.location.href.split("?")[1].split("&")[1].indexOf("=") != -1) {
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
            } else {
                alert("不能找到实验信息，请确保系统生成的url正确！");
                window.location.href = "/experimental_report/index.html";
            }
        } else {
            alert("不能找到实验信息，请确保系统生成的url正确！");
            window.location.href = "/experimental_report/index.html";
        }
    } else {
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
        document.title = experimentalInformation['title'] + " - 实验报告 - Cloud Lab";
        var courseId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
        var experimentalId = window.location.href.split("?")[1].split("&")[1].split("=")[1];
        document.getElementById("experimentalNameHref").innerHTML = "<a href=\"/experimental_report/show_experimental_report.html?courseId=" + courseId + "&experimentalId=" + experimentalId+ "&page=1\">" + experimentalInformation['title'] + "</a>";
        // if(experimentalInformation['content'].indexOf("pdf") == 0) {
        //     var windowHeight = window.screen.availHeight;
        //     var str = "<iframe id = \"experimentalDoc\" name=\"experimentalDoc\" frameborder=\"0\" src=\"" + experimentalInformation['experimentalUrl'] + "?experimentalNoCache=" + Math.random() + "\" height=\"" + (0.55 * windowHeight) + "px\" width=\"100%\" ></iframe>";
        //     document.getElementById("labs").innerHTML = str;
        // } else {
        //     document.getElementById("labs").innerHTML = experimentalInformation['content'];
        // }
    }
}

function getExperimentalReport() {
    if (window.location.href.indexOf("?") != -1) {
        if (window.location.href.split("?")[1].indexOf("&") != -1) {
            if (window.location.href.split("?")[1].split("&")[1].indexOf("=") != -1) {
                var experimentalId = window.location.href.split("?")[1].split("&")[1].split("=")[1];
                if (window.location.href.split("?")[1].split("&").length >= 3) {
                    if (window.location.href.split("?")[1].split("&")[2].indexOf("=") != -1) {
                        page = window.location.href.split("?")[1].split("&")[2].split("=")[1];
                    }
                }
                var obj = new Object();
                obj.experimentalId = experimentalId;
                obj.page = page;
                $.ajax({
                    url: "/get_experimental_report",
                    type: "POST",
                    cache: false,//设置不缓存
                    data: obj,
                    success: getExperimentalReportSuccess,
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
                alert("不能找到实验信息，请确保系统生成的url正确！");
                window.location.href = "/experimental_report/index.html";
            }
        } else {
            alert("不能找到实验信息，请确保系统生成的url正确！");
            window.location.href = "/experimental_report/index.html";
        }
    } else {
        alert("不能找到实验信息，请确保系统生成的url正确！");
        window.location.href = "/experimental_report/index.html";
    }
}

function getExperimentalReportSuccess(data) {
    if (data.indexOf("没有用户！") == 0) {
        setTimeout("getExperimentalInformation();", 500);
    } else {
        if (data.indexOf("页数出错！") == 0 || data.indexOf("超出页数！") == 0) {
            alert(data);
            try {
                var experimentalId = window.location.href.split("?")[1].split("&")[1].split("=")[1];
                var courseId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
                window.location.href = "/experimental_report/show_experimental_report.html?courseId=" + courseId + "&experimentalId=" + experimentalId + "&page=1";
            } catch (err) {
                window.location.href = "/experimental_report/index.html";
            }
        } else {
            if (data.indexOf("没有该实验！") == 0) {
                alert(data);
                try {
                    var courseId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
                    window.location.href = "/experimental_report/show.html?courseId=" + courseId;
                } catch (err) {
                    window.location.href = "/experimental_report/index.html";
                }
            } else {
                if (data.indexOf("抱歉，您的身份是") == 0) {
                    alert(data);
                    window.location.href = "/index.html";
                } else {
                    if (data.indexOf("没有实验报告！") == 0) {
                        document.getElementById("labs").innerHTML = data;
                        document.getElementById("experimentalReportCount").innerHTML = "（0）";
                        document.getElementById("pageNow").innerHTML = "&nbsp;&nbsp;1/1&nbsp;&nbsp;";
                        document.getElementById("previousPage").className = "previous disabled";
                        document.getElementById("previousPageHref").href = "javascript:void(0)";
                        document.getElementById("previousNext").className = "next disabled";
                        document.getElementById("previousNextHref").href = "javascript:void(0)";
                    } else {
                        try {
                            var experimentalId = window.location.href.split("?")[1].split("&")[1].split("=")[1];
                            var courseId = window.location.href.split("?")[1].split("&")[0].split("=")[1];
                            var obj = JSON.parse(data);
                            var pageCount = obj['pageCount'];
                            var experimentalReport = obj['experimentalReportList'];
                            var experimentalReportCount = obj['experimentalReportCount'];
                            document.getElementById("experimentalReportCount").innerHTML = "（" + experimentalReportCount + "）";
                            var str = "";
                            for(var i = 0; i < experimentalReport.length; i++) {
                                str += "<div class=\"lab-item \">";
                                str += "<div class=\"lab-item-title\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"" + experimentalReport[i].title + "\">" + experimentalReport[i].title + "</div>";
                                str += "<div class=\"pull-right lab-item-ctrl\">";
                                var createTime = experimentalReport[i].createTime;
                                createTime = createTime.split(".")[0];
                                str += createTime;
                                str += "&nbsp;&nbsp;&nbsp;&nbsp;"
                                // str += "<a class=\"btn btn-default\" href=\"/courses/show_experimental_information.html?coursesId=" + experimentalDocumentList[i].courseId + "&experimentalId=" + experimentalDocumentList[i].id + "\" >查看文档</a>";
                                str += "<a class=\"btn btn-primary\" href=\"/experimental_report/show_experimental_report_information.html?courseId=" + courseId + "&experimentalId=" + experimentalId + "&experimentalReportId=" + experimentalReport[i].id + "\">查看</a>";
                                str += "&nbsp;&nbsp;&nbsp;&nbsp;"
                                str += "<a class=\"btn btn-danger\" onclick=\"javascript:deleteExperimentalReport('" + experimentalReport[i].id + "')\">删除</a>";
                                str += "</div>";
                                str += "</div>";
                            }
                            document.getElementById("labs").innerHTML = str;
                            document.getElementById("pageNow").innerHTML = "&nbsp;&nbsp;" + page + "/" + pageCount + "&nbsp;&nbsp;";
                            if (page == 1) {
                                document.getElementById("previousPage").className = "previous disabled";
                                document.getElementById("previousPageHref").href = "javascript:void(0)";
                            } else {
                                document.getElementById("previousPage").className = "previous";
                                document.getElementById("previousPageHref").href = "/experimental_report/show_experimental_report.html?courseId=" + courseId + "&experimentalId=" + experimentalId + "&page=" + (page - 1);
                            }
                            if (page == pageCount) {
                                document.getElementById("previousNext").className = "next disabled";
                                document.getElementById("previousNextHref").href = "javascript:void(0)";
                            } else {
                                document.getElementById("previousNext").className = "next";
                                document.getElementById("previousNextHref").href = "/experimental_report/show_experimental_report.html?courseId=" + courseId + "&experimentalId" + experimentalId + "&page=" + (page + 1);
                            }
                        } catch (err) {
                            alert("不能找到课程信息与实验信息，请确保系统生成的url正确！");
                            window.location.href = "/experimental_report/index.html";
                        }
                    }
                }
            }
        }
    }
}

function deleteExperimentalReport(experimentalReportId) {
    if (confirm("确定删除该实验报告？删除后不可恢复！")) {
        var obj = new Object();
        obj.experimentalReportId = experimentalReportId;
        $.ajax({
            url: "/delete_experimental_report",
            type: "POST",
            cache: false,//设置不缓存
            data: obj,
            success: deleteExperimentalReportSuccess,
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

function deleteExperimentalReportSuccess(data) {
    if (data.indexOf("没有用户！") == 0) {
        window.location.href = "/index.html";
    } else {
        if (data.indexOf("抱歉，您的身份为") == 0) {
            alert(data);
            window.location.href = "/index.html";
        } else {
            if (data.indexOf("ok") == 0) {
                alert("删除成功！");
                window.location.href = window.location.href;
            } else {
                alert(data);
                window.location.href = window.location.href;
            }
        }
    }
}

$(document).ready(function () {
    getCourseInformation();
    getCourseExperimentalTop5();
    getExperimentalInformation();
    getExperimentalReport();
    // getCourseExperimental();
    // getOtherCourses();
});
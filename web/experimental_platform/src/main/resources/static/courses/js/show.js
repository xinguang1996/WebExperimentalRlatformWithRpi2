/**
 * Created by 郭欣光 on 2018/2/23.
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
            window.location.href = "/courses/index.html";
        }
    } else {
        alert("不能找到课程信息，请确保系统生成的url正确！");
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
        document.getElementById("teacherCoursesUrl").href = "/courses/teacher_courses.html?teacherId=" + course['teacher'] + "&page=1";
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
            window.location.href = "/courses/index.html";
        }
    } else {
        alert("不能找到课程信息，请确保系统生成的url正确！");
        window.location.href = "/courses/index.html";
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
            str += "<a class=\"btn btn-default\" href=\"/courses/show_experimental_information.html?coursesId=" + experimentalDocumentList[i].courseId + "&experimentalId=" + experimentalDocumentList[i].id + "\" >查看文档</a>";
            str += "<a class=\"btn btn-primary\" href=\"/experiment/index.html?courseId=" + experimentalDocumentList[i].courseId + "&experimentalId=" + experimentalDocumentList[i].id + "\" target=\"_blank\">开始实验</a>";
            str += "<a class=\"btn btn-info\" onclick=\"javascript:uploadExperimentalReport('" + experimentalDocumentList[i].id + "'); return false;\" >实验报告</a>";
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
            str += "<a href=\"/courses/show.html?courseId=" + courseList[i].id + "\">" + courseList[i].name + "</a>";
        }
        document.getElementById("otherCourses").innerHTML = str;
    }
}

function uploadExperimentalReport(experimentalId) {
    document.getElementById("uploadExperimentalReportFormExperimentalId").value = experimentalId;
    document.getElementById("uploadExperimentalReportFormHref").click();
}

function uploadExperimentalReportFormSubmit() {
    var name = document.getElementById("uploadExperimentalReportFormExperimentalNameInput").value;
    if (name == "" || name == null || name.length == 0) {
        alert("实验报告名称不能为空！")
    } else {
        if (name.length > 200) {
            alert("实验报告名称长度不能超过200字符！");
        } else {
            var formData = new FormData($('#uploadExperimentalReportForm1')[0]);
            $.ajax({
                type: "POST",
                url: "/upload_experimental_report",
                // async: false,//true表示同步，false表示异步
                cache: false,//设置不缓存
                data: formData,
                contentType: false,//必须设置false才会自动加上正确的Content-Tyoe
                processData: false,//必须设置false才避开jquery对formdata的默认处理，XMLHttpRequest会对formdata进行正确的处理
                success: uploadExperimentalReportFormSubmitSuccess,
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

function uploadExperimentalReportFormSubmitSuccess(data) {
    if (data.indexOf("ok") == 0) {
        alert("上传成功！");
        document.getElementById("uploadExperimentalReportFormClose").click();
        document.getElementById("uploadExperimentalReportFormExperimentalNameInput").value = "";
        document.getElementById("uploadExperimentalReportFormInput").value = "";
    } else {
        if (data.indexOf("该实验不存在！") == 0) {
            alert(data);
            window.location.href = window.location.href;
        } else {
            alert(data);
        }
    }
}

$(document).ready(function () {
    getCourseInformation();
    getCourseExperimental();
    getOtherCourses();
});
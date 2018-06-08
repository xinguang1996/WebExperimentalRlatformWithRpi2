/**
 * Created by 郭欣光 on 2018/1/6.
 */
var editor;

function createExperimentalDocument() {
    var experimentalTitle = document.getElementById("experimental_title").value;
    if(experimentalTitle == null || experimentalTitle == "") {
        alert("实验题目不能为空！");
        $("#experimental_title").focus();
    } else {
        if(experimentalTitle.length > 200) {
            alert("题目长度不能超过200个字符！");
            $("#experimental_title").focus();
        } else {
            var experimentalContent = editor.txt.html();
            var courseId = window.location.href.split("?")[1].split("=")[1];
            // alert(experimentalContent);
            // alert(experimentalContent.length);
            var obj = new Object();
            obj.experimentalTitle = experimentalTitle;
            obj.experimentalContent = experimentalContent;
            obj.courseId = courseId;
            $.ajax({
                url: "/create_experimental_document",
                type: "POST",
                cache: false,//设置不缓存
                data: obj,
                success: createExperimentalDocumentSuccess,
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

function createExperimentalDocumentSuccess(data) {
    if(data.indexOf("没有用户！") == 0) {
        window.location.href = "/developer/write_experimental_documents.html";
    } else {
        if(data.indexOf("您的身份是学生，仅有教师可以编写实验！") == 0) {
            alert(data);
            window.location.href = "/index.html";
        } else {
            if(data.indexOf("ok") == 0) {
                var courseId = window.location.href.split("?")[1].split("=")[1];
                window.location.href = "/developer/course_information.html?courseID=" + courseId;
            } else {
                alert(data);
            }
        }
    }
}

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
        document.getElementById("courseURL").href = "/developer/course_information.html?courseID=" + course['id'];
        document.getElementById("courseURL").innerHTML = course['name'];
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

function getCourseExperimentalTop5() {
    var courseId = window.location.href.split("?")[1].split("=")[1];
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
}

function getCourseExperimentalTop5Success(data) {
    if(data.indexOf("该课程暂时没有实验内容！") == 0) {
        document.getElementById("experimentalDocuments").innerHTML = data;
    } else {
        var str = "";
        var obj = JSON.parse(data);
        var experimentalDocumentList = obj.experimentalDocument;
        for(var i = 0; i < experimentalDocumentList.length; i++) {
            str += "<a href=\"/developer/show_experimental_information.html?courseID=" + experimentalDocumentList[i].courseId + "&experimentalId=" + experimentalDocumentList[i].id + "\">" + experimentalDocumentList[i].title + "</a>";
        }
        if(experimentalDocumentList.length >= 5) {
            str += "<a href=\"/developer/course_information.html?courseID=" + experimentalDocumentList[0].courseId + "\">查看更多</a>";
        }
        document.getElementById("experimentalDocuments").innerHTML = str;
    }
}

$(document).ready(function () {
    var E = window.wangEditor;
    editor = new E('#experimental_content');
    // 下面两个配置，使用其中一个即可显示“上传图片”的tab。但是两者不要同时使用！！！
    // editor.customConfig.uploadImgShowBase64 = true;   // 使用 base64 保存图片
    editor.customConfig.uploadImgServer = '/upload_experimental_img';  // 上传图片到服务器
    editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024;//将图片大小限制为10M，默认大小是5M
    editor.customConfig.uploadImgMaxLength = 1;//限制一次最多上传1张图片
    editor.customConfig.uploadFileName = 'experimentalImage';
    // editor.customConfig.uploadImgHeaders = {
    //     'Accept': 'text/x-json'
    // };
    editor.customConfig.pasteTextHandle = function(content) {
        var reTag = /<img[^>]*>/gi;
        if(content.match(reTag) != null) {
            alert("复制的内容含有图片，图片内容无法复制，请您在相应的地方手动插入图片");
            return content.replace(reTag, '');
        } else {
            return content;
        }
    }
    editor.customConfig.zIndex = 100;
    editor.create();
    getCourseInfo();
    getCourseExperimentalTop5();
});
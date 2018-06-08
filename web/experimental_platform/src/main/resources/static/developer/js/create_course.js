/**
 * Created by 郭欣光 on 2018/1/1.
 */

function selectCourseTap(tap) {
    var selectNode = document.getElementById(tap);
    var courseTap = selectNode.innerHTML;//获得标签名称
    var activeLink = document.getElementsByClassName("active");//获取class为active的对象
    //将原有的active特效清除
    for (var i = 0;i < activeLink.length ;i++) {
        var link = activeLink[i];
        if (link.id.indexOf("tap-") != -1) {
            link.className = "";
        }
    }
    selectNode.className = "active";
    document.getElementById("courseTap").value = courseTap;
}

function createCourse() {
    var courseTap = document.getElementById("courseTap").value;
    var courseName = document.getElementById("courseName").value;
    var courseDescribe = document.getElementById("courseDescribe").value;
    var courseImage = document.getElementById("courseImage").value;
    if(courseTap == "" || courseName == "" || courseDescribe == "" || courseImage == "") {
        document.getElementById("createCourseErrorInfo").innerHTML = "所有字段不能为空！";
        document.getElementById("showCreateCourseError").click();
        // alert("所有字段不能为空！");
    } else {
        if(courseName.length > 200) {
            document.getElementById("createCourseErrorInfo").innerHTML = "课程名称不能超过200个字符：您已经输入" + courseName.length + "个字符！";
            document.getElementById("showCreateCourseError").click();
            // alert("课程名称不能超过200个字符：您已经输入" + courseName.length + "个字符！");
            $("#courseName").focus();
        } else {
            if(courseDescribe.length > 800) {
                document.getElementById("createCourseErrorInfo").innerHTML = "课程描述不能超过800个字符：您已经输入" + courseDescribe.length + "个字符！";
                document.getElementById("showCreateCourseError").click();
                // alert("课程描述不能超过800个字符：您已经输入" + courseDescribe.length + "个字符！");
                $("#courseDescribe").focus();
            } else {
                var formData = new FormData($('#courseInfo')[0]);
                $.ajax({
                    type: "POST",
                    url: "/create_course",
                    // async: false,//true表示同步，false表示异步
                    cache: false,//设置不缓存
                    data: formData,
                    contentType: false,//必须设置false才会自动加上正确的Content-Tyoe
                    processData: false,//必须设置false才避开jquery对formdata的默认处理，XMLHttpRequest会对formdata进行正确的处理
                    success: function (data) {
                        if(data.indexOf("ok") == 0) {
                            alert("创建成功！");
                            window.location.href = "/developer/index.html";
                        } else {
                            document.getElementById("createCourseErrorInfo").innerHTML = data;
                            document.getElementById("showCreateCourseError").click();
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
                return false;
            }
        }
    }
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

$(document).ready(function () {
    getMyCoursesTop5();
});

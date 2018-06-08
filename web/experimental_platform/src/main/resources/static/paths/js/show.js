/**
 * Created by 郭欣光 on 2018/2/22.
 */

var courseTab = "Python";
var page = 1;
var pathName = "Python研发工程师";
var pathIntroduction = "";

function getPathNameAndIntroduction() {
    if(window.location.href.indexOf("?") != -1) {
        if(window.location.href.split("?")[1].indexOf("&") != -1) {
            if(window.location.href.split("?")[1].split("&")[0].indexOf("=") != -1) {
                courseTab = decodeURI(window.location.href.split("?")[1].split("&")[0].split("=")[1]);
                showPathNameAndIntroduction();
                if(window.location.href.split("?")[1].split("&")[1].indexOf("=") != -1) {
                    page = window.location.href.split("?")[1].split("&")[1].split("=")[1];
                }
                getCoursesCount();
                showCourses();
            } else {
                alert("没有找到您要查看的路径，请确保系统生成的url正确！");
                window.location.href = "/paths/index.html";
            }
        } else {
            if(window.location.href.split("?")[1].indexOf("=") != -1) {
                courseTab = decodeURI(window.location.href.split("?")[1].split("=")[1]);
                showPathNameAndIntroduction();
                getCoursesCount();
                showCourses();
            } else {
                alert("没有找到您要查看的路径，请确保系统生成的url正确！");
                window.location.href = "/paths/index.html";
            }
        }
    } else {
        alert("没有找到您要查看的路径，请确保系统生成的url正确！");
        window.location.href = "/paths/index.html";
    }
}

function showPathNameAndIntroduction() {
    if(courseTab.indexOf("Python") == 0) {
        pathName = "Python研发工程师";
        pathIntroduction = "Python（英国发音：/ˈpaɪθən/ 美国发音：/ˈpaɪθɑːn/）, 是一种面向对象的解释型计算机程序设计语言，由荷兰人Guido van Rossum于1989年发明，第一个公开发行版发行于1991年。Python是纯粹的自由软件， 源代码和解释器CPython遵循 GPL(GNU General Public License)协议。Python语法简洁清晰，特色之一是强制用空白符(white space)作为语句缩进。Python具有丰富和强大的库。它常被昵称为胶水语言，能够把用其他语言制作的各种模块（尤其是C/C++）很轻松地联结在一起。";
    } else {
        if(courseTab.indexOf("C/C++") == 0) {
            pathName = "C++研发工程师";
            pathIntroduction = "C++是C语言的继承，它既可以进行C语言的过程化程序设计，又可以进行以抽象数据类型为特点的基于对象的程序设计，还可以进行以继承和多态为特点的面向对象的程序设计。C++擅长面向对象程序设计的同时，还可以进行基于过程的程序设计，因而C++就适应的问题规模而论，大小由之。C++不仅拥有计算机高效运行的实用性特征，同时还致力于提高大规模程序的编程质量与程序设计语言的问题描述能力。";
        } else {
            if(courseTab.indexOf("信息安全") == 0) {
                pathName = "信息安全工程师";
                pathIntroduction = "信息安全主要包括以下五方面的内容，即需保证信息的保密性、真实性、完整性、未授权拷贝和所寄生系统的安全性。信息安全学科可分为狭义安全与广义安全两个层次，狭义的安全是建立在以密码论为基础的计算机安全领域，早期中国信息安全专业通常以此为基准，辅以计算机技术、通信网络技术与编程等方面的内容；广义的信息安全是一门综合性学科，从传统的计算机安全到信息安全，不但是名称的变更也是对安全发展的延伸，安全不在是单纯的技术问题，而是将管理、技术、法律等问题相结合的产物。本专业培养能够从事计算机、通信、电子商务、电子政务、电子金融等领域的信息安全高级专门人才。";
            } else {
                if(courseTab.indexOf("Linux") == 0) {
                    pathName = "Linux工程师";
                    pathIntroduction = "Linux是一套免费使用和自由传播的类Unix操作系统，是一个基于POSIX和UNIX的多用户、多任务、支持多线程和多CPU的操作系统。它能运行主要的UNIX工具软件、应用程序和网络协议。它支持32位和64位硬件。Linux继承了Unix以网络为核心的设计思想，是一个性能稳定的多用户网络操作系统。严格来讲，Linux这个词本身只表示Linux内核，但实际上人们已经习惯了用Linux来形容整个基于Linux内核，并且使用GNU 工程各种工具和数据库的操作系统。";
                } else {
                    if(courseTab.indexOf("Java") == 0) {
                        pathName = "Java研发工程师";
                        pathIntroduction = "Java是一门面向对象编程语言，不仅吸收了C++语言的各种优点，还摒弃了C++里难以理解的多继承、指针等概念，因此Java语言具有功能强大和简单易用两个特征。Java语言作为静态面向对象编程语言的代表，极好地实现了面向对象理论，允许程序员以优雅的思维方式进行复杂的编程。Java具有简单性、面向对象、分布式、健壮性、安全性、平台独立与可移植性、多线程、动态性等特点。Java可以编写桌面应用程序、Web应用程序、分布式系统和嵌入式系统应用程序等。";
                    } else {
                        if(courseTab.indexOf("PHP") == 0) {
                            pathName = "PHP研发工程师";
                            pathIntroduction = "PHP（外文名:PHP: Hypertext Preprocessor，中文名：“超文本预处理器”）是一种通用开源脚本语言。语法吸收了C语言、Java和Perl的特点，利于学习，使用广泛，主要适用于Web开发领域。PHP 独特的语法混合了C、Java、Perl以及PHP自创的语法。它可以比CGI或者Perl更快速地执行动态网页。用PHP做出的动态页面与其他的编程语言相比，PHP是将程序嵌入到HTML（标准通用标记语言下的一个应用）文档中去执行，执行效率比完全生成HTML标记的CGI要高许多；PHP还可以执行编译后代码，编译可以达到加密和优化代码运行，使代码运行更快。";
                        } else {
                            if(courseTab.indexOf("HTML5") == 0) {
                                pathName = "HTML5前端工程师";
                                pathIntroduction = "万维网的核心语言、标准通用标记语言下的一个应用超文本标记语言（HTML）的第五次重大修改（这是一项推荐标准、外语原文：W3C Recommendation）。2014年10月29日，万维网联盟宣布，经过接近8年的艰苦努力，该标准规范终于制定完成。";
                            } else {
                                if(courseTab.indexOf("NodeJS") == 0) {
                                    pathName = "NodeJS研发工程师";
                                    pathIntroduction = "Node.js是一个Javascript运行环境(runtime)，发布于2009年5月，由Ryan Dahl开发，实质是对Chrome V8引擎进行了封装。Node.js对一些特殊用例进行优化，提供替代的API，使得V8在非浏览器环境下运行得更好。V8引擎执行Javascript的速度非常快，性能非常好。Node.js是一个基于Chrome JavaScript运行时建立的平台， 用于方便地搭建响应速度快、易于扩展的网络应用。Node.js 使用事件驱动， 非阻塞I/O 模型而得以轻量和高效，非常适合在分布式设备上运行数据密集型的实时应用。";
                                } else {
                                    if(courseTab.indexOf("Docker") == 0) {
                                        pathName = "Docker工程师"
                                        pathIntroduction = "Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口。";
                                    } else {
                                        alert("没有该路径，请确认系统生成的url是否正确！");
                                        window.location.href = "/paths/index.html";
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    document.title = pathName + " - 学习路径 - Cloud Lab";
    document.getElementById("coursePathMow").innerHTML = "<a href=\"/paths/show.html?pathName=" + courseTab + "&page=1\">" + pathName + "</a>";
    document.getElementById("coursePathName").innerHTML = pathName;
    document.getElementById("pathIntroduction").innerHTML = pathIntroduction;
}

function getCoursesCount() {
    var tab = [courseTab];
    var obj = new Object();
    obj.coursesTab = tab + "";
    $.ajax({
        url: "/get_courses_count_by_tab",
        type: "POST",
        data: obj,
        cache: false,//设置不缓存
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
    var obj = JSON.parse(data);
    var coursesCountList = obj['coursesCountList'];
    document.getElementById("coursesCount").innerHTML = coursesCountList[0];
}

function showCourses() {
    var obj = new Object();
    obj.tab = courseTab;
    obj.page = page;
    $.ajax({
        url: "/show_courses_by_tab_and_page",
        type: "POST",
        data: obj,
        cache: false,//设置不缓存
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
    if(data.indexOf("暂无课程！") == 0) {
        document.getElementById("coursesInformation").innerHTML = data;
        document.getElementById("pageNow").innerHTML = "&nbsp;&nbsp;1/1&nbsp;&nbsp;";
    } else {
        if(data.indexOf("超出页数！") == 0) {
            window.location.href = "/paths/index.html";
        } else {
            var obj = JSON.parse(data);
            var courseList = obj['courseList'];
            var pageCount = obj['pageCount'];
            var str = "";
            for(var i = 0; i < courseList.length; i++) {
                str += "<div class=\"col-md-4 col-sm-6  course\">";
                str += "<a class=\"course-box\" href=\"/courses/show.html?courseId=" + courseList[i].id + "\">";
                str += "<div class=\"sign-box\">";
                str += " <i class=\"fa fa-star-o course-follow pull-right\"";
                str += " data-follow-url=\"/courses/63/follow\"";
                str += " data-unfollow-url=\"/courses/63/unfollow\"  style=\"display:none\"  ></i>";
                str += "</div>";
                str += "<div class=\"course-img\">";
                str += "<img alt=\"" + courseList[i].name + "\" src=\"/user/course/img/" + courseList[i].img +"\">";
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
                document.getElementById("previousPageHref").href = "/paths/show.html?pathName=" + courseTab + "&page=" + (page - 1);
            }
            if(page == pageCount) {
                document.getElementById("previousNext").className = "next disabled";
                document.getElementById("previousNextHref").href = "javascript:void(0)";
            } else {
                document.getElementById("previousNext").className = "next";
                document.getElementById("previousNextHref").href = "/paths/show.html?pathName=" + courseTab + "&page=" + (page + 1);
            }
        }
    }
}

$(document).ready(function () {
    getPathNameAndIntroduction();
});
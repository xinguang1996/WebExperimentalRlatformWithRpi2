package com.gxg.controller;

import com.gxg.entities.ExperimentalImageUploadResult;
import com.gxg.entities.User;
import com.gxg.services.CourseService;
import org.json.JSONObject;
import org.omg.CORBA.PUBLIC_MEMBER;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.jws.soap.SOAPBinding;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.websocket.server.PathParam;
import java.util.ArrayList;

/**
 * Created by 郭欣光 on 2018/1/5.
 */


@Controller
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping(value = "/create_course")
    @ResponseBody
    public String createCourse(@RequestParam("courseTap") String courseTap, @RequestParam("courseName") String courseName, @RequestParam("courseDescribe") String courseDescribe, @RequestParam("courseImage") MultipartFile courseImage, HttpServletRequest request) {

        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return courseService.createCourse(courseTap, courseName, courseDescribe, courseImage, user);
        }
    }

    @PostMapping(value = "/create_experimental_document")
    @ResponseBody
    public String createExperimentalDocument(@RequestParam("experimentalTitle") String experimentalTitle, @RequestParam("experimentalContent") String experimentalContent, @RequestParam("courseId") String courseId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return courseService.createExperimental(experimentalTitle, experimentalContent, courseId, user);
        }
    }

    @PostMapping(value = "/get_my_courses")
    @ResponseBody
    public String getMyCourses(@RequestParam("page") String page, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return courseService.getMyCourses(page, user);
        }
    }

    @PostMapping(value = "/get_course_info")
    @ResponseBody
    public String getCourseInfo(@RequestParam("courseId") String courseId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") != null) {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        }
        return courseService.getCourseInfoById(courseId);
    }

    @PostMapping(value = "/get_teacher_courses_count")
    @ResponseBody
    public String getTeacherCoursesCount(@RequestParam("teacherId") String teacherId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") != null) {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        }
        return courseService.getCoursesCountByTeacher(teacherId);
    }

    @PostMapping(value = "/get_my_courses_top_5")
    @ResponseBody
    public String getMyCoursesTop5(HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return courseService.getCoursesTop5ByTeacher(user.getId());
        }
    }

    @RequestMapping(value = "/upload_experimental_img")
    @ResponseBody
    public ExperimentalImageUploadResult uploadExperimentalImg(@RequestParam("experimentalImage") MultipartFile experimentalImage) {
        if(experimentalImage.isEmpty()) {
            System.out.println("kong");
        }
//        JSONObject jsonObject = new JSONObject();
        String result = courseService.uploadExperimentalImg(experimentalImage);
        ExperimentalImageUploadResult uploadResult = new ExperimentalImageUploadResult();
        if(result.equals("error")) {
            uploadResult.setErrno(1);
            ArrayList<String> arrayList = new ArrayList<String>();
            arrayList.add("error");
            uploadResult.setData(arrayList);
        } else {
            uploadResult.setErrno(0);
            ArrayList<String> arrayList = new ArrayList<String>();
            arrayList.add(result);
            uploadResult.setData(arrayList);
        }
        return uploadResult;
    }

    @PostMapping(value = "/get_course_experimental")
    @ResponseBody
    public String getCourseExperimental(@RequestParam("courseId") String courseId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") != null) {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        }
        return courseService.getCourseExperimental(courseId);
    }

    @PostMapping(value = "/get_course_experimental_top5")
    @ResponseBody
    public String getCourseExperimentalTop5(@RequestParam("courseId") String courseId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") != null) {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        }
        return courseService.getCourseExperimentalTop5(courseId);
    }

    @PostMapping(value = "/get_experimental_information")
    @ResponseBody
    public String getExperimentalInformation(@RequestParam("experimentalId") String experimentalId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") != null) {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        }
        return courseService.getExperimetalInformation(experimentalId);
    }

    @PostMapping(value = "/upload_experimental_document")
    @ResponseBody
    public String uploadExperimentalDocument(@PathParam("courseId") String courseId, @PathParam("experimentalDocumentTitle") String experimentalDocumentTitle, @PathParam("experimentalDocument") MultipartFile experimentalDocument, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return courseService.uploadExperimentalDocument(courseId, experimentalDocumentTitle, experimentalDocument);
        }
    }

    @PostMapping("/edit_course_information")
    @ResponseBody
    public String editCourseInformation(@RequestParam("courseId") String courseId, @RequestParam("courseName") String courseName, @RequestParam("courseDescription") String courseDescription, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return courseService.editCourseInformation(courseId, courseName, courseDescription);
        }
    }

    @PostMapping("/delete_course")
    @ResponseBody
    public String deleteCourse(@RequestParam("courseId") String courseId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return courseService.deleteCourse(courseId, user);
        }
    }

    @PostMapping("/edit_experimental_document")
    @ResponseBody
    public String editExperimentalDocument(@PathParam("experimentalId") String experimentalId, @PathParam("experimentalTitle") String experimentalTitle, @PathParam("experimentalContent") String experimentalContent, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return courseService.editExperimentalDocument(experimentalId, experimentalTitle, experimentalContent, user);
        }
    }

    @PostMapping("/edit_experimental_document_title")
    @ResponseBody
    public String editExperimentalDocumentTitle(@RequestParam("experimentalId") String experimentalId, @RequestParam("experimentalTitle") String experimentalTitle, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return courseService.editExperimentalDocumentTitle(experimentalId, experimentalTitle, user);
        }
    }

    @PostMapping("/edit_experimental_document_content")
    @ResponseBody
    public String editExperimentalDocumentContent(@RequestParam("editExperimentalDocumentContentPdfExperimentalId") String editExperimentalDocumentContentPdfExperimentalId, @RequestParam("editExperimentDocumentInput") MultipartFile editExperimentalDocumentInput, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return courseService.editExperimentalDocumentContent(editExperimentalDocumentContentPdfExperimentalId, editExperimentalDocumentInput, user);
        }
    }

    @PostMapping("/delete_experimental_document")
    @ResponseBody
    public String deleteExperimentalDocument(@RequestParam("experimentalId") String experimentalId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return courseService.deleteExperimentalDocument(experimentalId, user);
        }
    }

    @PostMapping("/get_courses_top4")
    @ResponseBody
    public String getCoursesTop4(HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") != null) {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        }
        return courseService.getCoursesTopNumber(4);
    }

    @PostMapping("/get_courses_count_by_tab")
    @ResponseBody
    public String getCoursesCountByTab(@RequestParam("coursesTab") String[] coursesTab, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") != null) {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        }
        return courseService.getCoursesCountByTab(coursesTab);
    }

    @PostMapping("/show_courses_by_tab_and_page")
    @ResponseBody
    public String showCoursesByTabAndPage(@RequestParam("tab") String tab, @RequestParam("page") int page, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") != null) {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        }
        return courseService.getCoursesByTabAndPage(tab, page);
    }

    @PostMapping("/get_courses_top5")
    @ResponseBody
    public String getCoursesTop5(HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") != null) {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        }
        return courseService.getCoursesTopNumber(5);
    }

    @PostMapping("/get_experimental_document")
    @ResponseBody
    public String getExperimentalDocument(@RequestParam("experimentalId") String experimentalId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") != null) {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        } else {
//            return "error:没有用户！";
        }
        return courseService.getExperimentalDocument(experimentalId);
    }

    @PostMapping("/upload_experimental_environment")
    @ResponseBody
    public String uploadExperimentalEnvironment(@RequestParam("courseId") String courseId, @RequestParam("experimentalEnvironment") MultipartFile experimentalEnvironment, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return courseService.uploadExperimentalEnvironment(user, experimentalEnvironment, courseId);
        }
    }

    @PostMapping("/get_course_experimental_environment")
    @ResponseBody
    public String getCourseExperimentalEnvironment(@RequestParam("courseId") String courseId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") != null) {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        }
        return courseService.getCourseExperimentalEnvironment(courseId);
    }

    @PostMapping("/send_experimental_environment")
    @ResponseBody
    public String sendExperimentalEnvironment(@RequestParam("experimentalEnvironmentId") String experimentalEnvironmentId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return courseService.sendExperimentalEnvironment(experimentalEnvironmentId, user);
        }
    }

    @PostMapping("/delete_experimental_environment")
    @ResponseBody
    public String deleteExperimentalEnvironment(@RequestParam("experimentalEnvironmentId") String experimentalEnvironmentId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return courseService.deleteExperimentalEnvironment(experimentalEnvironmentId, user);
        }
    }

    @PostMapping("/get_teacher_courses")
    @ResponseBody
    public String getTeacherCourses(@RequestParam("teacherId") String teacherId, @RequestParam("page") String page, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (session.getAttribute("user") != null) {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        }
        return courseService.getTeacherCourses(teacherId, page);
    }

    @PostMapping(value = "/upload_experimental_report")
    @ResponseBody
    public String uploadExperimentalReport(@RequestParam("uploadExperimentalReportFormExperimentalId") String experimentalId, @RequestParam("uploadExperimentalReportFormExperimentalNameInput") String experimentalReportName, @RequestParam("uploadExperimentalReportFormInput") MultipartFile experimentalReport, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (session.getAttribute("user") != null) {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        }
        return courseService.uploadExperimentalReport(experimentalId, experimentalReportName, experimentalReport);
    }

    @PostMapping(value = "/get_experimental_report")
    @ResponseBody
    public String getExperimentalReport(@RequestParam("experimentalId") String experimentalId, @RequestParam("page") String page, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return courseService.getExperimentalReport(experimentalId, page, user);
        }
    }

    @PostMapping(value = "/get_experimental_report_top5")
    @ResponseBody
    public String getExperimentalReportTop5(@RequestParam("experimentalId") String experimentalId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (session.getAttribute("user") != null) {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        }
        return courseService.getExperimentalReportTop5(experimentalId);
    }

    @PostMapping(value = "/get_experimental_report_information")
    @ResponseBody
    public String getExperimentalReportInformation(@RequestParam("experimentalReportId") String experimentalReportId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return courseService.getExperimentalReportInformation(experimentalReportId, user);
        }
    }

    @PostMapping(value = "/delete_experimental_report")
    @ResponseBody
    public String deleteExperimentalReport(@RequestParam("experimentalReportId") String experimentalReportId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return courseService.deleteExperimentalReport(experimentalReportId, user);
        }
    }
}

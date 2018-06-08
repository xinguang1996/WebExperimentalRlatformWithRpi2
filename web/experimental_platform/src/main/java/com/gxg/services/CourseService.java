package com.gxg.services;

import com.gxg.dao.*;
import com.gxg.entities.*;
import org.apache.commons.net.ftp.FTP;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.parsing.ReaderContext;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Created by 郭欣光 on 2018/1/5.
 */

@Service
public class CourseService {

    @Value("${course.img.dir}")
    private String courseImgDir;

    @Value("${user.resources.url}")
    private String userResourcesUrl;

    @Autowired
    private CourseDao courseDao;

    @Autowired
    private ExperimentalDocumentDao experimentalDocumentDao;

    @Autowired
    private FileService fileService;

    @Value("${course.page.amount}")
    private int coursePageAmount;

    @Value("${teacher.course.page.amount}")
    private int teacherCoursePageAmount;

    @Autowired
    private ExperimentalEnvironmentDao experimentalEnvironmentDao;

    @Value("${experimental.environment.url}")
    private String experimentalEnvironmentUrl;

    @Autowired
    private FtpService ftpService;

    @Autowired
    private VNCService vncService;

    @Value("${experimental.node.username}")
    private String username;

    @Value("${experimental.node.password}")
    private String password;

    @Autowired
    private SftpService sftpService;

    @Value("${sftp.port}")
    private Integer sftpPort;

    @Autowired
    private UserDao userDao;

    @Autowired
    private ExperimentalReportDao experimentalReportDao;

    @Value("${experimental_report_page_amount}")
    private int experimentalReportPageAmount;

    /**
     * 该方法用于创建新课程
     * @param courseTap 课程标签
     * @param courseName 课程名称
     * @param courseDescribe 课程描述
     * @param courseImage 课程图片
     * @param user 创建人
     * @return
     */
    public String createCourse(String courseTap, String courseName, String courseDescribe, MultipartFile courseImage, User user) {

        if(courseTap == null || courseTap.equals("") || courseName.equals("") || courseName == null || courseDescribe == null || courseDescribe.equals("")) {
            return "所有字段不能为空！";
        } else {
            if(user.getRole().equals("教师")) {
                String teacher;
                Timestamp time;
                String id;
                String imgName;
                if(!courseImage.isEmpty()) {
                    synchronized (this) {
                        try {
                            teacher = user.getId();
                            String fileName = courseImage.getOriginalFilename();//获取上传文件的文件名
                            String fileType = fileName.substring(fileName.lastIndexOf(".") + 1);//获取文件后缀名
                            time = new Timestamp(System.currentTimeMillis());
                            String timeString = time.toString();
                            id = teacher + timeString.split(" ")[0].split("-")[0] + timeString.split(" ")[0].split("-")[1] + timeString.split(" ")[0].split("-")[2] + timeString.split(" ")[1].split(":")[0] + timeString.split(" ")[1].split(":")[1] + timeString.split(" ")[1].split(":")[2].split("\\.")[0];//注意，split是按照正则表达式进行分割，.在正则表达式中为特殊字符，需要转义。
                            while (courseDao.getCourseCountById(id) != 0) {
                                Random random = new Random(100);
                                Long idLong = Long.parseLong(id);
                                idLong += random.nextLong();
                                id = idLong + "";
                                if (id.length() > 22) {
                                    id = id.substring(0, 23);
                                }
                            }
                            imgName = id + "." + fileType;
                            File uploadDir = new File(courseImgDir);
                            //如果上传目录不存在则创建
                            if (!uploadDir.exists()) {
                                uploadDir.mkdirs();
                            }
                            BufferedOutputStream outputStream = new BufferedOutputStream(new FileOutputStream(new File(courseImgDir, imgName)));
                            outputStream.write(courseImage.getBytes());
                            outputStream.flush();
                            outputStream.close();
                        } catch (FileNotFoundException e) {
                            e.printStackTrace();
                            return "上传图片失败：" + e.getMessage();
                        } catch (IOException e) {
                            e.printStackTrace();
                            return "上传图片失败：" + e.getMessage();
                        }
                        try {
                            courseDao.createCourse(id, courseName, courseTap, courseDescribe, imgName, teacher, time, time);
                        } catch (Exception e) {
                            System.out.println(e.getMessage());
                            String deleteImgResult = fileService.deleteFile(courseImgDir + imgName);
                            System.out.println(deleteImgResult);
                            return "操作数据库失败！";
                        }
                        return "ok";
                    }
                } else {
                    return "上传的图片为空！";
                }
            } else {
                return "您的身份是学生，仅有教师可以创建课程！";
            }
        }
    }

    /**
     * 该方法用于创建实验（自己编写）
     * @param experimentalTitle 实验题目
     * @param experimentalContent 实验内容
     * @param courseId 课程表示
     * @param user 创建用户
     * @return
     */
    public String createExperimental(String experimentalTitle, String experimentalContent, String courseId, User user) {
        if(experimentalContent.equals("") || experimentalContent == null) {
            return "您的实验内容为空！";
        } else {
            if(user.getRole().equals("教师")) {
//                String teacherId = user.getId();
                String experimentalId;
                Timestamp time;
                String experimentalSrc;
                String experimentalName;
                synchronized (this) {
                    try {
                        time = new Timestamp(System.currentTimeMillis());
                        String timeString = time.toString();
                        experimentalId = timeString.split(" ")[0].split("-")[0] + timeString.split(" ")[0].split("-")[1] + timeString.split(" ")[0].split("-")[2] + timeString.split(" ")[1].split(":")[0] + timeString.split(" ")[1].split(":")[1] + timeString.split(" ")[1].split(":")[2].split("\\.")[0];
                        while (experimentalDocumentDao.getExperimentalDocumentCountById(experimentalId) != 0) {
                            Random random = new Random(100);
                            Long experimentalIdLong = Long.parseLong(experimentalId);
                            experimentalIdLong += random.nextLong();
                            experimentalId = experimentalIdLong + "";
                            if (experimentalId.length() > 14) {
                                experimentalId.substring(0, 15);
                            }
                        }
                        experimentalName = experimentalId + ".html";
                        experimentalSrc = userResourcesUrl + "course/experimental/" + courseId + "/";
                        File uploadDir = new File(experimentalSrc);
                        //如果上传目录不存在则创建
                        if (!uploadDir.exists()) {
                            uploadDir.mkdirs();
                        }
                        File file = new File(experimentalSrc + experimentalName);
                        FileOutputStream fileOutputStream = new FileOutputStream(file);
                        byte by[] = experimentalContent.getBytes();
                        fileOutputStream.write(by);
                        fileOutputStream.close();
                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                        return "往服务器中写入实验内容时失败：" + e.getMessage();
                    } catch (IOException e) {
                        e.printStackTrace();
                        return "往服务器中写入实验内容时失败：" + e.getMessage();
                    }
                    try {
                        experimentalDocumentDao.createExperimentalDocumental(experimentalId, experimentalTitle, experimentalName, courseId, time, time);
                    } catch (Exception e) {
                        System.out.println(e.getMessage());
                        System.out.println(fileService.deleteFile(experimentalSrc + experimentalName));
                        return "操作数据库失败！";
                    }
                    try {
                        courseDao.updateModificationTimeById(time, courseId);
                    } catch (Exception e) {
                        System.out.println(e.getMessage());
                    } finally {
                        return "ok";
                    }
                }
            } else {
                return "您的身份是学生，仅有教师可以编写实验！";
            }
        }
    }

    /**
     * 该方法用于教师获取自己的课程列表
     * @param page 页数
     * @param user 课程所有人
     * @return
     */
    public String getMyCourses(String page, User user) {
        if(user.getRole().equals("学生")) {
            return "您的身份是学生，仅有教师可以编写实验！";
        }
        int pageInt = 1;
        try {
            pageInt = Integer.parseInt(page);
        } catch (Exception e) {
            return "页数出错！";
        }
        int coursesCount = courseDao.getCoursesCountByTeacher(user.getId());
        if (coursesCount == 0) {
            return "暂无课程！";
        } else {
            if (coursesCount <= (pageInt - 1) * teacherCoursePageAmount) {
                return "超出页数！";
            } else {
                List<Course> courseList = courseDao.getCoursesByTeacherAndPage(user.getId(), pageInt);
                int pageCount = ((coursesCount % teacherCoursePageAmount) == 0) ? (coursesCount / teacherCoursePageAmount) : ((coursesCount / teacherCoursePageAmount) + 1);
                JSONObject coursesJson = new JSONObject();
                coursesJson.accumulate("pageCount", pageCount);
                coursesJson.accumulate("courseList", courseList);
                return coursesJson.toString();
            }
        }
    }

    /**
     * 该方法用于获得课程信息
     * @param courseId 课程标识
     * @return
     */
    public String getCourseInfoById(String courseId) {
        Course course = courseDao.getCourseById(courseId);
        if(course == null) {
            return "没有该课程！";
        } else {
            return course.toString();
        }
    }

    /**
     * 该方法用于获得教师开设课程的数量
     * @param teacher 教师id
     * @return
     */
    public String getCoursesCountByTeacher(String teacher) {
        return courseDao.getCoursesCountByTeacher(teacher) + "";
    }

    /**
     * 该方法用于获得教师前5个课程列表
     * @param teacher 教师id
     * @return
     */
    public String getCoursesTop5ByTeacher(String teacher) {
        List<Course> courseList = courseDao.getCoursesTop5ByTeacher(teacher);
        if(courseList == null) {
            return "没有课程！";
        } else {
            JSONObject jsonObject = new JSONObject();
            jsonObject.accumulate("teacherCourses", courseList);
            return jsonObject.toString();
        }
    }

    /**
     * 该方法用于处理编写实验文档时上传的图片
     * @param ExperimentalImage 图片
     * @return
     */
    public String uploadExperimentalImg(MultipartFile ExperimentalImage) {
        String imgName;
        synchronized (this) {
            try {
                String fileName = ExperimentalImage.getOriginalFilename();//获取上传文件的文件名
                String fileType = fileName.substring(fileName.lastIndexOf(".") + 1);//获取文件后缀名
                Timestamp time = new Timestamp(System.currentTimeMillis());
                String timeString = time.toString();
                String imgId = timeString.split(" ")[0].split("-")[0] + timeString.split(" ")[0].split("-")[1] + timeString.split(" ")[0].split("-")[2] + timeString.split(" ")[1].split(":")[0] + timeString.split(" ")[1].split(":")[1] + timeString.split(" ")[1].split(":")[2].split("\\.")[0];//注意，split是按照正则表达式进行分割，.在正则表达式中为特殊字符，需要转义。
                imgName = imgId + "." + fileType;
                String experimentalImgUrl = userResourcesUrl + "course/experimental/img/";
                File uploadDir = new File(experimentalImgUrl);
                //如果上传目录不存在则创建
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }
                while ((new File(experimentalImgUrl, imgName)).exists()) {
                    Long imgIdLong = Long.parseLong(imgId);
                    Random random = new Random(100);
                    imgIdLong += random.nextLong();
                    imgId = imgIdLong + "";
                    imgName = imgId + "." + fileType;
                }
                BufferedOutputStream outputStream = new BufferedOutputStream(new FileOutputStream(new File(experimentalImgUrl, imgName)));
                outputStream.write(ExperimentalImage.getBytes());
                outputStream.flush();
                outputStream.close();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
                return "error";
            } catch (IOException e) {
                e.printStackTrace();
                return "error";
            }
        }
        return "/user/course/experimental/img/" + imgName;
    }

    /**
     * 该方法用于获得课程内部实验列表
     * @param courseId 课程id
     * @return
     */
    public String getCourseExperimental(String courseId) {
        List<ExperimentalDocument> experimentalDocumentList = experimentalDocumentDao.getExperimentalDocumentByCourseId(courseId);
        if(experimentalDocumentList == null) {
            return "该课程暂时没有实验内容！";
        } else {
            JSONObject jsonObject = new JSONObject();
            ArrayList<ExperimentalDocument> experimentalDocumentArrayList = new ArrayList<ExperimentalDocument>();
            for(int i = 0; i < experimentalDocumentList.size(); i++) {
                experimentalDocumentArrayList.add(experimentalDocumentList.get(i));
            }
            jsonObject.accumulate("experimentalDocument", experimentalDocumentArrayList);
            return jsonObject.toString();
        }
    }

    /**
     * 该方法用于获取该课程前5个实验列表
     * @param courseId 课程id
     * @return
     */
    public String getCourseExperimentalTop5(String courseId) {
        List<ExperimentalDocument> experimentalDocumentList = experimentalDocumentDao.getExperimentalDocumentTop5ByCourseId(courseId);
        if (experimentalDocumentList == null) {
            return "该课程暂时没有实验内容！";
        } else {
            JSONObject jsonObject = new JSONObject();
            ArrayList<ExperimentalDocument> experimentalDocumentArrayList = new ArrayList<ExperimentalDocument>();
            for (int i = 0; i < experimentalDocumentList.size(); i++) {
                experimentalDocumentArrayList.add(experimentalDocumentList.get(i));
            }
            jsonObject.accumulate("experimentalDocument", experimentalDocumentArrayList);
            return jsonObject.toString();
        }
    }

    /**
     * 该方法用于获得实验信息
     * @param experimentalId 实验id
     * @return
     */
    public String getExperimetalInformation(String experimentalId) {
        ExperimentalDocument experimentalDocument = experimentalDocumentDao.getExperimentalDocumentById(experimentalId);
        if(experimentalDocument == null) {
            return "error:没有该实验！";
        } else {
            String title = experimentalDocument.getTitle();
            String courseId = experimentalDocument.getCourseId();
            String name = experimentalDocument.getName();
            String fileType = name.substring(name.lastIndexOf(".") + 1);//获取文件后缀名
            if(fileType.equals("pdf")) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.accumulate("title", title);
                jsonObject.accumulate("content", "pdf");
                jsonObject.accumulate("experimentalUrl", "/user/course/experimental/" + courseId + "/" + name);
                return jsonObject.toString();
            } else {
                String fileUrl = userResourcesUrl + "course/experimental/" + courseId + "/" + name;
                File file = new File(fileUrl);
                if(file.exists()) {
                    try{
                        BufferedReader bufferedReader = new BufferedReader(new FileReader(fileUrl));
                        String temp;
                        String content = "";
                        while((temp = bufferedReader.readLine()) != null) {
                            content += temp;
                            content += "\n";
                        }
                        bufferedReader.close();
                        JSONObject jsonObject = new JSONObject();
                        jsonObject.accumulate("title", title);
                        jsonObject.accumulate("content", content);
                        return jsonObject.toString();
                    } catch (Exception e) {
                        e.printStackTrace();
                        return "error:" + e.getMessage();
                    }

                } else {
                    return "error:服务器没有该实验文档，可能该实验文档丢失！";
                }
            }
        }
    }

    /**
     * 该方法用于上传实验文档
     * @param courseId 课程id
     * @param experimentalDocumentTitle 实验标题
     * @param experimentalDocument 实验文档
     * @return
     */
    public String uploadExperimentalDocument(String courseId, String experimentalDocumentTitle, MultipartFile experimentalDocument) {
        if(courseDao.getCourseCountById(courseId) == 0) {
            return "没有该课程！";
        } else {
            if(experimentalDocumentTitle == null || experimentalDocumentTitle.equals("")) {
                return "实验题目不能为空！";
            } else {
                String id;
                Timestamp time;
                String name;
                String uploadDir;
                if(!experimentalDocument.isEmpty()) {
                    synchronized (this) {
                        try {
                            String fileName = experimentalDocument.getOriginalFilename();//获取上传文件的文件名
                            String fileType = fileName.substring(fileName.lastIndexOf(".") + 1);//获取文件后缀名
                            time = new Timestamp(System.currentTimeMillis());
                            String timeString = time.toString();
                            id = timeString.split(" ")[0].split("-")[0] + timeString.split(" ")[0].split("-")[1] + timeString.split(" ")[0].split("-")[2] + timeString.split(" ")[1].split(":")[0] + timeString.split(" ")[1].split(":")[1] + timeString.split(" ")[1].split(":")[2].split("\\.")[0];//注意，split是按照正则表达式进行分割，.在正则表达式中为特殊字符，需要转义。
                            while (experimentalDocumentDao.getExperimentalDocumentCountById(id) != 0) {
                                Random random = new Random(100);
                                Long idLong = Long.parseLong(id);
                                idLong += random.nextLong();
                                id = idLong + "";
                                if (id.length() > 14) {
                                    id = id.substring(0, 15);
                                }
                            }
                            name = id + "." + fileType;
                            uploadDir = userResourcesUrl + "/course/experimental/" + courseId + "/";
                            File uploadFileDir = new File(uploadDir);
                            if (!uploadFileDir.exists()) {
                                uploadFileDir.mkdirs();
                            }
                            BufferedOutputStream outputStream = new BufferedOutputStream(new FileOutputStream(new File(uploadDir, name)));
                            outputStream.write(experimentalDocument.getBytes());
                            outputStream.flush();
                            outputStream.close();
                        } catch (FileNotFoundException e) {
                            e.printStackTrace();
                            return "上传文档失败：" + e.getMessage();
                        } catch (IOException e) {
                            e.printStackTrace();
                            return "上传文档失败：" + e.getMessage();
                        }
                        try {
                            experimentalDocumentDao.createExperimentalDocumental(id, experimentalDocumentTitle, name, courseId, time, time);
                        } catch (Exception e) {
                            System.out.println(e.getMessage());
                            String deleteFileResult = fileService.deleteFile(uploadDir + name);
                            if (!deleteFileResult.equals("ok")) {
                                System.out.println(deleteFileResult);
                            }
                            return "操作数据库失败！";
                        }
                        try {
                            courseDao.updateModificationTimeById(time, courseId);
                        } catch (Exception e) {
                            System.out.println(e.getMessage());
                        } finally {
                            return "上传成功！";
                        }
                    }
                } else {
                    return "文件为空！";
                }
            }
        }
    }

    /**
     * 该方法用于处理更改课程信息
     * @param courseId 课程id
     * @param courseName 课程名称
     * @param courseDescription 课程描述
     * @return
     */
    public String editCourseInformation(String courseId, String courseName, String courseDescription) {
        if(courseId.equals("") || courseId == null) {
            return "无法正确获得课程编号，请确认系统生成的url是否正确！";
        } else {
            if(courseName.equals("") || courseName == null) {
                return "课程名称不能为空！";
            } else {
                if(courseDescription.equals("") || courseDescription == null) {
                    return "课程描述不能为空！";
                } else {
                    if(courseName.length() > 200) {
                        return "课程名称不能超过200字符！";
                    } else {
                        if(courseDescription.length() > 800) {
                            return "课程描述不能超过800字符！";
                        } else {
                            if(courseDao.getCourseCountById(courseId) == 0) {
                                return "没有该课程编号的课程，可能系统生成的url发生改动，或课程已经被删除！";
                            } else {
                                Timestamp time = new Timestamp(System.currentTimeMillis());
                                try {
                                    courseDao.updateNameAndDescriptionAndModificationTimeById(courseId, courseName, courseDescription, time);
                                    return "ok";
                                } catch (Exception e) {
                                    System.out.println(e.getMessage());
                                    return "操作数据库失败！";
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * 该方法用于删除课程信息
     * @param courseId 课程id
     * @return
     */
    public String deleteCourse(String courseId, User user) {
        if(courseId.equals("") || courseId == null) {
            return "不能获得课程号，请确认系统生成的url是否正确！";
        } else {
            if(courseDao.getCourseCountById(courseId) == 0) {
                return "没有该课程编号的课程，可能系统生成的url发生改动，或课程已经被删除！";
             } else {
                Course course = courseDao.getCourseById(courseId);
                if(course == null) {
                    return "没有该课程编号的课程，可能系统生成的url发生改动，或课程已经被删除！";
                } else {
                    int experimentDocumentCount = experimentalDocumentDao.getExperimentalDocumentCountByCourseId(courseId);
                    if (experimentDocumentCount != 0) {
                        String deleteExperimentalDocumentAllResult = "";
                        List<ExperimentalDocument> experimentalDocumentList = experimentalDocumentDao.getExperimentalDocumentByCourseId(courseId);
                        for (ExperimentalDocument experimentalDocument : experimentalDocumentList) {
                            String deleteExperimentalDocumentResult = this.deleteExperimentalDocument(experimentalDocument.getId(), user);
                            if (!("ok".equals(deleteExperimentalDocumentResult))) {
                                deleteExperimentalDocumentAllResult += "删除实验文档" + experimentalDocument.getId() + "出错：" + deleteExperimentalDocumentResult + "\n";
                            }
                        }
                        if (!("".equals(deleteExperimentalDocumentAllResult))) {
                            deleteExperimentalDocumentAllResult += "其他实验文档已经删除成功！实验课程没有被删除！";
                            return deleteExperimentalDocumentAllResult;
                        }
                    }
                    int experimentalEnvironmentCount = experimentalEnvironmentDao.getExperimentalEnvironmentCountByCourse(courseId);
                    if (experimentalEnvironmentCount != 0) {
                        String deleteExperimentalEnvironmentAllResult = "";
                        List<ExperimentalEnvironment> experimentalEnvironmentList = experimentalEnvironmentDao.getExperimentalEnviromentByCourse(courseId);
                        for (ExperimentalEnvironment experimentalEnvironment : experimentalEnvironmentList) {
                            String deleteExperimentalEnvironmentResult = this.deleteExperimentalEnvironment(experimentalEnvironment.getId(), user);
                            if (!("ok".equals(deleteExperimentalEnvironmentResult))) {
                                deleteExperimentalEnvironmentAllResult += "删除实验环境" + experimentalEnvironment.getId() + "出错：" + deleteExperimentalEnvironmentResult + "\n";
                            }
                        }
                        if (!("".equals(deleteExperimentalEnvironmentAllResult))) {
                            deleteExperimentalEnvironmentAllResult += "实验文档已经删除成功，其他实验环境已经删除成功！实验课程没有被删除！";
                            return deleteExperimentalEnvironmentAllResult;
                        }
                    }
                    String courseImgPath = courseImgDir + course.getImg();
                    String deleteImgResult = fileService.deleteFile(courseImgPath);
                    if(deleteImgResult.equals("ok") || deleteImgResult.equals("删除文件失败：文件不存在！")) {
                        if (deleteImgResult.equals("删除文件失败：文件不存在！")) {
                            System.out.println(deleteImgResult);
                        }
//                        List<ExperimentalDocument> experimentalDocumentList = experimentalDocumentDao.getExperimentalDocumentByCourseId(courseId);
//                        if(experimentalDocumentList != null) {
//                            for(ExperimentalDocument experimentalDocument : experimentalDocumentList) {
//                                String experimentalDocumentPath = userResourcesUrl + "course/experimental/" + courseId + "/" + experimentalDocument.getName();
//                                String deleteExperimentalDocumentResult = fileService.deleteFile(experimentalDocumentPath);
//                                if(deleteExperimentalDocumentResult.equals("ok")) {
//                                    experimentalDocumentDao.deleteExperimentalDocumentById(experimentalDocument.getId());
//                                } else {
//                                    if(deleteExperimentalDocumentResult.equals("删除文件失败：文件不存在！")) {
//                                        return "系统没有找到课程内的实验" + experimentalDocument.getTitle() + ",导致删除该课程失败，可能有部分实验已经删除！";
//                                    } else {
//                                        return "因为系统原因导致删除课程内实验" + experimentalDocument.getTitle() + "失败，导致删除该课程失败，可能有部分实验已经删除！";
//                                    }
//                                }
//                            }
//                        }
                        try {
                            courseDao.deleteCourseById(courseId);
                            return "ok";
                        } catch (Exception e) {
                            System.out.println(e.getMessage());
                            return "删除课程失败：操作数据库出错！但是课程图片和实验文档及实验报告已经删除！";
                        }
                    } else {
                        return "因系统原因删除课程图片失败，导致删除课程失败！";
//                        if(deleteImgResult.equals("删除文件失败：文件不存在！")) {
//                            return "系统没有找到课程图片，因此导致删除课程失败！";
//                        } else {
//                            return "因系统原因删除课程图片失败，导致删除课程失败！";
//                        }
                    }
                }
            }
        }
    }

    /**
     * 该方法用于处理修改实验文档
     * @param experimentalId 实验id
     * @param experimentalTitle 实验题目
     * @param experimentalContent 实验内容
     * @param user 修改人
     * @return
     */
    public String editExperimentalDocument(String experimentalId, String experimentalTitle, String experimentalContent, User user) {
        if(experimentalTitle == null || experimentalTitle.equals("")) {
            return "实验题目不能为空！";
        } else {
            if(experimentalTitle.length() > 200) {
                return "实验题目不能超过200字符！";
            } else {
                if(user.getRole().equals("教师")) {
                    if(experimentalDocumentDao.getExperimentalDocumentCountById(experimentalId) == 0) {
                        return "没有找到对应实验，可能系统生成的url被改变，或服务器删除了该实验信息！";
                    } else {
                        if(experimentalContent == null || experimentalContent.equals("")) {
                            return "实验内容为空！";
                        } else {
                            ExperimentalDocument experimentalDocument = experimentalDocumentDao.getExperimentalDocumentById(experimentalId);
                            if(experimentalDocument == null) {
                                return "没有找到对应实验，可能系统生成的url被改变，或服务器删除了该实验信息！";
                            } else {
                                String experimentalName = experimentalDocument.getName();
                                String courseId = experimentalDocument.getCourseId();
                                String experimentalSrc = userResourcesUrl + "course/experimental/" + courseId + "/";
                                String writeFileResult = fileService.writeFile(experimentalSrc, experimentalName, experimentalContent);
                                if(writeFileResult.equals("ok")) {
                                    Timestamp time = new Timestamp(System.currentTimeMillis());
                                    try {
                                        experimentalDocumentDao.updateTitleAndModificationTimeById(experimentalId, experimentalTitle, time);
                                    } catch (Exception e) {
                                        System.out.println(e.getMessage());
                                        return "操作数据库失败！";
                                    }
                                    try {
                                        courseDao.updateModificationTimeById(time, courseId);
                                    } catch (Exception e) {
                                        System.out.println(e.getMessage());
                                    } finally {
                                        return "ok";
                                    }
                                } else {
                                    return writeFileResult;
                                }
                            }
                        }
                    }
                } else {
                    return "抱歉，您的身份是学生，仅有教师可以修改实验！";
                }
            }
        }
    }

    /**
     * 该方法用于修改实验文档标题
     * @param experimentalId 实验id
     * @param experimentalTitle 实验标题
     * @param user 修改人
     * @return
     */
    public String editExperimentalDocumentTitle(String experimentalId, String experimentalTitle, User user) {
        if(experimentalTitle == null || experimentalTitle.equals("")) {
            return "实验题目不能为空！";
        } else {
            if(experimentalTitle.length() > 200) {
                return "实验题目长度不能超过200字符！";
            } else {
                if(user.getRole().equals("教师")) {
                    if(experimentalDocumentDao.getExperimentalDocumentCountById(experimentalId) == 0) {
                        return "没有找到该实验相关信息，可能服务器已经删除该实验！";
                    } else {
                        ExperimentalDocument experimentalDocument = experimentalDocumentDao.getExperimentalDocumentById(experimentalId);
                        if(experimentalDocument == null) {
                            return "没有找到该实验相关信息，可能服务器已经删除该实验！";
                        } else {
                            Timestamp time = new Timestamp(System.currentTimeMillis());
                            try {
                                experimentalDocumentDao.updateTitleAndModificationTimeById(experimentalId, experimentalTitle, time);
                            } catch (Exception e) {
                                System.out.println(e.getMessage());
                                return "操作数据库失败！";
                            }
                            try {
                                courseDao.updateModificationTimeById(time, experimentalDocument.getCourseId());
                            } catch (Exception e) {
                                System.out.println(e.getMessage());
                            } finally {
                                return "ok";
                            }
                        }
                    }
                } else {
                    return "您的身份是学生，仅有教师可以修改实验！";
                }
            }
        }
    }

    /**
     * 该方法用于修改pdf实验文档内容
     * @param editExperimentalDocumentContentPdfExperimentalId 实验文档id
     * @param editExperimentalDocumentInput 上传的pdf文件
     * @param user 修改人
     * @return
     */
    public String editExperimentalDocumentContent(String editExperimentalDocumentContentPdfExperimentalId, MultipartFile editExperimentalDocumentInput, User user) {
        if(user.getRole().equals("教师")) {
            if(experimentalDocumentDao.getExperimentalDocumentCountById(editExperimentalDocumentContentPdfExperimentalId) == 0) {
                return "没有找到该实验相关信息，可能系统已经删除该实验信息！";
            } else {
                ExperimentalDocument experimentalDocument = experimentalDocumentDao.getExperimentalDocumentById(editExperimentalDocumentContentPdfExperimentalId);
                if(experimentalDocument == null) {
                    return "没有找到该实验相关信息，可能系统已经删除该实验信息！";
                } else {
                    String fileName = editExperimentalDocumentInput.getOriginalFilename();//获取上传文件的文件名
                    String fileType = fileName.substring(fileName.lastIndexOf(".") + 1);//获取文件后缀名
                    if(fileType.equals("pdf") || fileType.equals("html") || fileType.equals("htm")) {
                        String courseId = experimentalDocument.getCourseId();
                        String path = userResourcesUrl + "/course/experimental/" + courseId + "/";
                        String name  = editExperimentalDocumentContentPdfExperimentalId + "." + fileType;
                        String uploadFileResult = fileService.uploadFile(editExperimentalDocumentInput, name, path);
                        if(uploadFileResult.equals("ok")) {
                            Timestamp time = new Timestamp(System.currentTimeMillis());
                            try {
                                experimentalDocumentDao.updateModificationTimeById(editExperimentalDocumentContentPdfExperimentalId, time);
                                courseDao.updateModificationTimeById(time, courseId);
                            } catch (Exception e) {
                                System.out.println(e.getMessage());
                            } finally {
                                return "ok";
                            }
                        } else {
                            return uploadFileResult;
                        }
                    } else {
                        return "仅支持上传pdf或html格式的文件，暂不支持其他类型文件！";
                    }
                }
            }
        } else {
            return "抱歉，您的身份是学生，仅有教师可以修改实验！";
        }
    }

    /**
     * 该方法用于删除实验文档
     * @param experimentalId 实验ID
     * @param user 删除人
     * @return
     */
    public String deleteExperimentalDocument(String experimentalId, User user) {
        if(user.getRole().equals("教师")) {
            if(experimentalDocumentDao.getExperimentalDocumentCountById(experimentalId) == 0) {
                return "没有找到该实验信息，可能系统已经删除该实验！";
            } else {
                ExperimentalDocument experimentalDocument = experimentalDocumentDao.getExperimentalDocumentById(experimentalId);
                if(experimentalDocument == null) {
                    return "没有找到该实验信息，可能系统已经删除该实验！";
                } else {
                    int experimentalReportCount = experimentalReportDao.getExperimentalReportCountByExperimentalId(experimentalId);
                    if (experimentalReportCount != 0) {
                        List<ExperimentalReport> experimentalReportList = experimentalReportDao.getExperimentalReportByExperimentalIdAndStartLimitAndEndLimit(experimentalId, 0, experimentalReportCount);
                        String deleteExperimentalReportAllResult = "";
                        for (ExperimentalReport experimentalReport : experimentalReportList) {
                            String deleteExperimentalReportResult = this.deleteExperimentalReport(experimentalReport.getId(), user);
                            if (!("ok".equals(deleteExperimentalReportResult))) {
                                deleteExperimentalReportAllResult += "删除" + experimentalReport.getId() + "实验报告出错：" + deleteExperimentalReportResult + "\n";
                            }
                        }
                        if (!("".equals(deleteExperimentalReportAllResult))) {
                            deleteExperimentalReportAllResult += "其他实验报告删除成功！该实验文档没有删除！";
                            return deleteExperimentalReportAllResult;
                        }
                    }
                    String experimentalName = experimentalDocument.getName();
                    String courseId = experimentalDocument.getCourseId();
                    String path = userResourcesUrl + "course/experimental/" + courseId + "/" + experimentalName;
                    String deleteFileResult = fileService.deleteFile(path);
                    if (deleteFileResult.equals("ok") || deleteFileResult.equals("删除文件失败：文件不存在！")) {
                        if (deleteFileResult.equals("删除文件失败：文件不存在！")) {
                            System.out.println(deleteFileResult);
                        }
                        Timestamp time = new Timestamp(System.currentTimeMillis());
                        try {
                            experimentalDocumentDao.deleteExperimentalDocumentById(experimentalId);
                        } catch (Exception e) {
                            System.out.println(e.getMessage());
                            return "删除实验失败：更新数据库失败，但实验文档已经被删除！";
                        }
                        try {
                            courseDao.updateModificationTimeById(time, courseId);
                        } catch (Exception e) {
                            System.out.println(e.getMessage());
                        }
                        return "ok";
                    } else {
                        return "删除实验文档失败";
//                        if (deleteFileResult.equals("删除文件失败：文件不存在！")) {
//                            return "删除实验文档失败，因为该文档不存在，可能已经被删除！";
//                        }
//                        if (deleteFileResult.equals("删除文件失败！")) {
//                            return "删除实验文档失败";
//                        }
//                        return deleteFileResult;
                    }
                }
            }
        } else {
            return "抱歉，您的身份是学生，仅有教师可以修改实验！";
        }
    }

    /**
     * 该方法用于获得课程前number的列表
     * @param number 获得课程数量
     * @return
     */
    public String getCoursesTopNumber(int number) {
        if(courseDao.getCoursesCount() == 0) {
            return "暂无课程！";
        } else {
            List<Course> courseList = courseDao.getCoursesTopNumber(number);
            if(courseList == null) {
                return "暂无课程！";
            } else {
                JSONObject coursesJson = new JSONObject();
                coursesJson.accumulate("courseList", courseList);
                return coursesJson.toString();
            }
        }
    }

    /**
     * 该方法用于获得某个标签课程的数量
     * @param coursesTab 课程标签
     * @return
     */
    public String getCoursesCountByTab(String[] coursesTab) {
        ArrayList<Integer> coursesCountList = new ArrayList<>();
        for(int i = 0; i < coursesTab.length; i++) {
            coursesCountList.add(courseDao.getCoursesCountByTab(coursesTab[i]));
        }
        JSONObject jsonObject = new JSONObject();
        jsonObject.accumulate("coursesCountList", coursesCountList);
        return jsonObject.toString();
    }

    /**
     * 该方法用于通过标签和页码获得课程列表
     * @param tab 标签
     * @param page 页码
     * @return
     */
    public String getCoursesByTabAndPage(String tab, int page) {
        if(tab.equals("all")) {
            int coursesCount = courseDao.getCoursesCount();
            if(coursesCount == 0) {
                return "暂无课程！";
            } else {
                int coursesPageCount = coursesCount % coursePageAmount == 0 ? coursesCount / coursePageAmount : coursesCount / coursePageAmount + 1;
                if(page > coursesPageCount) {
                    return "超出页数！";
                } else {
                    List<Course> courseList = courseDao.getCoursesByLimit(coursePageAmount * (page - 1), coursePageAmount);
                    if(courseList == null) {
                        return "暂无课程！";
                    } else {
                        JSONObject jsonObject = new JSONObject();
                        jsonObject.accumulate("courseList", courseList);
                        jsonObject.accumulate("pageCount", coursesPageCount);
                        return jsonObject.toString();
                    }
                }
            }
        } else {
            int coursesCount = courseDao.getCoursesCountByTab(tab);
            if(coursesCount == 0) {
                return "暂无课程！";
            } else {
                int coursesPageCount = coursesCount % coursePageAmount == 0 ? coursesCount / coursePageAmount : coursesCount / coursePageAmount + 1;
                if(page > coursesPageCount) {
                    return "超出页数！";
                } else {
                    List<Course> courseList = courseDao.getCoursesByTabAndLimit(tab, coursePageAmount * (page - 1), coursePageAmount);
                    if(courseList == null) {
                        return "暂无课程！";
                    } else {
                        JSONObject jsonObject = new JSONObject();
                        jsonObject.accumulate("courseList", courseList);
                        jsonObject.accumulate("pageCount", coursesPageCount);
                        return jsonObject.toString();
                    }
                }
            }
        }
    }

    /**
     * 该方法用于获得实验文档
     * @param experimentalId 实验id
     * @return
     */
    public String getExperimentalDocument(String experimentalId) {
        ExperimentalDocument experimentalDocument = experimentalDocumentDao.getExperimentalDocumentById(experimentalId);
        if(experimentalDocument == null) {
            return "error:没有该实验！";
        } else {
            return experimentalDocument.toString();
        }
    }

    /**
     * 该方法用于上传实验环境文件
     * @param user 上传人
     * @param experimentalEnvironment 实验环境文件
     * @param courseId 课程id
     * @return
     */
    public String uploadExperimentalEnvironment(User user, MultipartFile experimentalEnvironment, String courseId) {
        if(user.getRole().equals("教师")) {
            if(courseDao.getCourseCountById(courseId) == 0) {
                return "没有该课程！";
            } else {
                long size = experimentalEnvironment.getSize();
                double sizeDouble = (double)size / 1024;
                if(sizeDouble > 5 * 1024 * 1024) {
                    return "上传文件超过指定大小！";
                } else {
                    synchronized (this) {
                        String name = experimentalEnvironment.getOriginalFilename();
                        Timestamp time = new Timestamp(System.currentTimeMillis());
                        String timeString = time.toString();
                        String id = timeString.split(" ")[0].split("-")[0] + timeString.split(" ")[0].split("-")[1] + timeString.split(" ")[0].split("-")[2] + timeString.split(" ")[1].split(":")[0] + timeString.split(" ")[1].split(":")[1] + timeString.split(" ")[1].split(":")[2].split("\\.")[0];//注意，split是按照正则表达式进行分割，.在正则表达式中为特殊字符，需要转义。
                        while (experimentalEnvironmentDao.getExperimentalEnvironmentCountById(id) != 0) {
                            Random random = new Random(100);
                            Long idLong = Long.parseLong(id);
                            idLong += random.nextLong();
                            id = idLong + "";
                            if (id.length() > 14) {
                                id = id.substring(0, 15);
                            }
                        }
                        String path = userResourcesUrl + "course/experimental_environment/" + courseId + "/" + id + "/";
                        String uploadResult = fileService.uploadFile(experimentalEnvironment, name, path);
                        if (uploadResult.equals("ok")) {
                            ExperimentalEnvironment experimentalEnvironment1 = new ExperimentalEnvironment();
                            experimentalEnvironment1.setId(id);
                            experimentalEnvironment1.setName(name);
                            experimentalEnvironment1.setStatus("已上传");
                            experimentalEnvironment1.setCourse(courseId);
                            experimentalEnvironment1.setSize(sizeDouble);
                            experimentalEnvironment1.setCreateTime(time);
                            try {
                                experimentalEnvironmentDao.createExperimetalEnvironment(experimentalEnvironment1);
                            } catch (Exception e) {
                                System.out.println(e.getMessage());
                                String deleteFile = fileService.deleteFile(path + name);
                                System.out.println(deleteFile);
                                return "操作数据库失败！";
                            }
                            try {
                                courseDao.updateModificationTimeById(time, courseId);
                            } catch (Exception e) {
                                System.out.println(e.getMessage());
                            } finally {
                                return "上传成功！";
                            }
                        } else {
                            return uploadResult;
                        }
                    }
                }
            }
        } else {
            return "您的身份是" + user.getRole() + ", 仅教师可以发布实验环境";
        }
    }

    /**
     * 该方法用于获得课程实验环境文件的信息
     * @param courseId 课程id
     * @return
     */
    public String getCourseExperimentalEnvironment(String courseId) {
        if(courseDao.getCourseCountById(courseId) == 0) {
            return "没有该课程！";
        } else {
            if(experimentalEnvironmentDao.getExperimentalEnvironmentCountByCourse(courseId) == 0) {
                return "该课程暂没有上传实验环境！";
            } else {
                List<ExperimentalEnvironment> experimentalEnvironmentList = experimentalEnvironmentDao.getExperimentalEnviromentByCourse(courseId);
                if(experimentalEnvironmentList == null) {
                    return "该课程暂没有上传实验环境！";
                } else {
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.accumulate("experimentalEnvironmentList", experimentalEnvironmentList);
                    return jsonObject.toString();
                }
            }
        }
    }

    /**
     * 该方法用于发送实验环境到实验节点
     * @param experimentalEnvironmentId 实验环境id
     * @param user 发送人
     * @return
     */
    public String sendExperimentalEnvironment(String experimentalEnvironmentId, User user) {
        if(user.getRole().equals("教师")) {
            if(experimentalEnvironmentDao.getExperimentalEnvironmentCountById(experimentalEnvironmentId) == 0) {
                return "没有该实验环境！";
            } else {
                ExperimentalEnvironment experimentalEnvironment = experimentalEnvironmentDao.getExperimentalEnvironmentById(experimentalEnvironmentId);
                if(experimentalEnvironment == null) {
                    return "没有该实验环境！";
                } else {
                    String path = userResourcesUrl + "course/experimental_environment/" + experimentalEnvironment.getCourse() + "/" + experimentalEnvironment.getId() + "/" + experimentalEnvironment.getName();
                    List<ExperimentalNode> experimentalNodeList = vncService.getAllExperimentalNode();
                    if(experimentalNodeList == null) {
                        return "没有节点！";
                    } else {
                        String errorReqult = "";
                        Boolean ftpSuccess = true;
                        for(ExperimentalNode experimentalNode : experimentalNodeList) {
//                            String result = ftpService.ftpSendFile(path, experimentalEnvironmentUrl, experimentalNode.getIp(), username, password);
                            String result = sftpService.uploadFile(experimentalEnvironmentUrl, path, experimentalEnvironment.getName(), username, password, experimentalNode.getIp(), sftpPort);
                            if(result.equals("ok")) {
                                continue;
                            } else {
                                ftpSuccess = false;
                                errorReqult += result + "\n";
                            }
                        }
                        if(ftpSuccess) {
                            try {
                                experimentalEnvironmentDao.updateStatusById("已发送", experimentalEnvironmentId);
                                return "ok";
                            } catch (Exception e) {
                                System.out.println(e.getMessage());
                                return "已发送成功，但操作数据库失败，导致状态为改变！";
                            }
                        } else {
                            return errorReqult;
                        }
                    }
                }
            }
        } else {
            return "抱歉，您的身份是" + user.getRole() + "，仅有教师可以发送实验环境！";
        }
    }

    /**
     * 该方法用于删除实验环境文件
     * @param experimentalEnvironmentId 实验环境id
     * @param user 删除人
     * @return
     */
    public String deleteExperimentalEnvironment(String experimentalEnvironmentId, User user) {
        if(user.getRole().equals("教师")) {
            if(experimentalEnvironmentDao.getExperimentalEnvironmentCountById(experimentalEnvironmentId) == 0) {
                return "没有该实验环境！";
            } else {
                ExperimentalEnvironment experimentalEnvironment = experimentalEnvironmentDao.getExperimentalEnvironmentById(experimentalEnvironmentId);
                if(experimentalEnvironment == null) {
                    return "没有该实验环境！";
                } else {
                    String path = userResourcesUrl + "course/experimental_environment/" + experimentalEnvironment.getCourse() + "/" + experimentalEnvironment.getId() + "/" + experimentalEnvironment.getName();
                    String deleteFileResult = fileService.deleteFile(path);
                    if(deleteFileResult.equals("ok") || deleteFileResult.equals("删除文件失败：文件不存在！")) {
                        if (deleteFileResult.equals("删除文件失败：文件不存在！")) {
                            System.out.println(deleteFileResult);
                        }
                        try {
                            experimentalEnvironmentDao.deleteExperimentalEnvironmentById(experimentalEnvironmentId);
                            return "ok";
                        } catch (Exception e) {
                            System.out.println(e.getMessage());
                            return "删除实验环境失败：操作数据库失败，但实验环境文件已经被删除！";
                        }
                    } else {
                        return deleteFileResult;
                    }
                }
            }
        } else {
            return "抱歉，您的身份是" + user.getRole() + "，仅有教师可以删除实验环境！";
        }
    }

    /**
     * 该方法用于获得某位教师课程列表
     * @param teacherId 教师id
     * @param page 页码
     * @return
     */
    public String getTeacherCourses(String teacherId, String page) {
        int pageInt = 1;
        try {
            pageInt = Integer.parseInt(page);
        } catch (Exception e) {
            return "页数无法转换为整数！";
        }
        User user = userDao.getUser(teacherId);
        if (user == null) {
            return "没有该教师！";
        } else {
            if (user.getRole().equals("教师")) {
                int coursesCount = courseDao.getCoursesCountByTeacher(teacherId);
                if (coursesCount == 0) {
                    return "暂没有课程内容！";
                } else {
                    if (coursesCount <= (pageInt - 1) * coursePageAmount) {
                        return "超出页数！";
                    } else {
                        List<Course> courseList = courseDao.getCoursesByTeacherAndPage(teacherId, pageInt);
                        int pageCount = ((coursesCount % teacherCoursePageAmount) == 0 ) ? (coursesCount / teacherCoursePageAmount) : ((coursesCount / teacherCoursePageAmount) + 1);
                        JSONObject jsonObject = new JSONObject();
                        jsonObject.accumulate("pageCount", pageCount);
                        jsonObject.accumulate("courseList", courseList);
                        return jsonObject.toString();
                    }
                }
            } else {
                return "没有该教师！";
            }
        }
    }

    public String uploadExperimentalReport(String experimentalId, String experimentalRepoetTitle, MultipartFile experimentalReportFile) {
        if (experimentalId == null || experimentalId.equals("") || experimentalId.length() == 0) {
            return "没有找到相关实验！";
        }
        if (experimentalRepoetTitle == null || experimentalRepoetTitle.equals("") || experimentalRepoetTitle.length() == 0) {
            return "实验报告题目不能为空！";
        }
        if (experimentalDocumentDao.getExperimentalDocumentCountById(experimentalId) == 0) {
            return "该实验不存在！";
        }
        String id;
        Timestamp timestamp;
        String name;
        if (experimentalReportFile.isEmpty()) {
            return "文件不能为空！";
        } else {
            String fileName = experimentalReportFile.getOriginalFilename();//获取上传文件的文件名
            String fileType = fileName.substring(fileName.lastIndexOf(".") + 1);//获取文件后缀名
            if (fileType.equals("pdf")) {
                synchronized (this) {
                    timestamp = new Timestamp(System.currentTimeMillis());
                    String timeString = timestamp.toString();
                    id = timeString.split(" ")[0].split("-")[0] + timeString.split(" ")[0].split("-")[1] + timeString.split(" ")[0].split("-")[2] + timeString.split(" ")[1].split(":")[0] + timeString.split(" ")[1].split(":")[1] + timeString.split(" ")[1].split(":")[2].split("\\.")[0];//注意，split是按照正则表达式进行分割，.在正则表达式中为特殊字符，需要转义。
                    while (experimentalReportDao.getExperimentalReportCountById(id) != 0) {
                        Random random = new Random(100);
                        Long idLong = Long.parseLong(id);
                        idLong += random.nextLong();
                        id = idLong + "";
                        if (id.length() > 14) {
                            id = id.substring(0, 15);
                        }
                    }
                    name = id + "." + fileType;
                    String uploadDir = userResourcesUrl + "/course/experimental_report/" + experimentalId + "/";
                    String uploadResult = fileService.uploadFile(experimentalReportFile, name, uploadDir);
                    if (uploadResult.equals("ok")) {
                        ExperimentalReport experimentalReport = new ExperimentalReport();
                        experimentalReport.setId(id);
                        experimentalReport.setTitle(experimentalRepoetTitle);
                        experimentalReport.setName(name);
                        experimentalReport.setCreateTime(timestamp);
                        experimentalReport.setExperimentalId(experimentalId);
                        try {
                            experimentalReportDao.insertExperimentalReport(experimentalReport);
                            return "ok";
                        } catch (Exception e) {
                            System.out.println(e.getMessage());
                            String deleteFileResult = fileService.deleteFile(uploadDir + name);
                            System.out.println(deleteFileResult);
                            return "写入数据库时出错！";
                        }
                    } else {
                        return uploadResult;
                    }
                }
            } else {
                return "上传的文档必须为pdf格式！";
            }
        }
    }

    public String getExperimentalReport(String experimentalId, String page, User user) {
        if (user.getRole().equals("教师")) {
            int pageInt = 1;
            int experimentalReportCount = 0;
            try {
                pageInt = Integer.parseInt(page);
            } catch (Exception e) {
                return "页数出错！";
            }
            if (experimentalDocumentDao.getExperimentalDocumentCountById(experimentalId) == 0) {
                return "没有该实验！";
            }
            experimentalReportCount = experimentalReportDao.getExperimentalReportCountByExperimentalId(experimentalId);
            if (experimentalReportCount == 0) {
                return "没有实验报告！";
            } else {
                if (experimentalReportCount <= (pageInt - 1) * experimentalReportPageAmount) {
                    return "超出页数！";
                } else {
                    int pageCount = (experimentalReportCount % experimentalReportPageAmount == 0) ? (experimentalReportCount / experimentalReportPageAmount) : (experimentalReportCount / experimentalReportPageAmount + 1);
                    List<ExperimentalReport> experimentalReportList = experimentalReportDao.getExperimentalReportByExperimentalIdAndStartLimitAndEndLimit(experimentalId, (pageInt - 1) * experimentalReportPageAmount, experimentalReportPageAmount);
                    JSONObject jsonObject = new JSONObject();
                    jsonObject.accumulate("experimentalReportList", experimentalReportList);
                    jsonObject.accumulate("pageCount", pageCount);
                    jsonObject.accumulate("experimentalReportCount", experimentalReportCount);
                    return jsonObject.toString();
                }
            }
        } else {
            return "抱歉，您的身份是" + user.getRole() + "，仅有教师可以查看实验报告！";
        }
    }

    public String getExperimentalReportTop5(String experimentalId) {
        if (experimentalDocumentDao.getExperimentalDocumentCountById(experimentalId) == 0) {
            return "没有该实验！";
        }
        if (experimentalReportDao.getExperimentalReportCountByExperimentalId(experimentalId) == 0) {
            return "暂无实验报告！";
        } else {
            List<ExperimentalReport> experimentalReportList = experimentalReportDao.getExperimentalReportByExperimentalIdAndStartLimitAndEndLimit(experimentalId, 0, 5);
            JSONObject jsonObject = new JSONObject();
            jsonObject.accumulate("experimentalReportList", experimentalReportList);
            return jsonObject.toString();
        }
    }

    public String getExperimentalReportInformation(String experimentalReportId, User user) {
        if (user.getRole().equals("教师")) {
            if (experimentalReportDao.getExperimentalReportCountById(experimentalReportId) == 0) {
                return "没有该实验报告！";
            } else {
                ExperimentalReport experimentalReport = experimentalReportDao.getExperimentalReportById(experimentalReportId);
                String experimentalReportSrc = "/user/course/experimental_report/" + experimentalReport.getExperimentalId() + "/" + experimentalReport.getName();
                JSONObject jsonObject = new JSONObject();
                jsonObject.accumulate("experimentalReport", experimentalReport);
                jsonObject.accumulate("experimentalReportSrc", experimentalReportSrc);
                return jsonObject.toString();
            }
        } else {
            return "抱歉，您的身份是" + user.getRole() + "，仅有教师可以查看实验报告！";
        }
    }

    public String deleteExperimentalReport(String experimentalReportId, User user) {
        if (user.getRole().equals("教师")) {
            if (experimentalReportDao.getExperimentalReportCountById(experimentalReportId) == 0) {
                return "没有该实验报告！";
            } else {
                ExperimentalReport experimentalReport = experimentalReportDao.getExperimentalReportById(experimentalReportId);
                String experimentalReportSrc = userResourcesUrl + "/course/experimental_report/" + experimentalReport.getExperimentalId() + "/" + experimentalReport.getName();
                String deleteFileResult = fileService.deleteFile(experimentalReportSrc);
                if (deleteFileResult.equals("ok") || deleteFileResult.equals("删除文件失败：文件不存在！")) {
                    if (deleteFileResult.equals("删除文件失败：文件不存在！")) {
                        System.out.println(deleteFileResult);
                    }
                    try {
                        experimentalReportDao.deleteExperimentalReportById(experimentalReportId);
                        return "ok";
                    } catch (Exception e) {
                        System.out.println(e.getMessage());
                        return "操作数据库失败！但是实验报告已经删除！";
                    }
                } else {
                    return deleteFileResult;
                }
            }
        } else {
            return "抱歉，您的身份为" + user.getRole() + "，仅有教师可以删除实验报告！";
        }
    }
}

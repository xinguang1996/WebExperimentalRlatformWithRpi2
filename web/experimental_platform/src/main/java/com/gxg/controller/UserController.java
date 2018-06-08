package com.gxg.controller;

import com.gxg.entities.User;
import com.gxg.services.UserService;
import com.gxg.services.VNCService;
import org.springframework.beans.factory.annotation.Autowired;;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Created by 郭欣光 on 2017/12/27.
 */

@Controller
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private VNCService vncService;
    /**
     * 用于用户登录验证
     */
    @PostMapping(value = "/login")
//    @GetMapping(value = "/login")
    @ResponseBody
    public String login(@RequestParam("id") String id, @RequestParam("password") String password, @RequestParam("checkCode") String checkCode, HttpServletRequest request) {

        HttpSession session = request.getSession();
//        session.setAttribute("checkCode", "123456");
        if(session.getAttribute("checkCode") == null) {
            return "随机验证码出错！";
        } else {
            if(session.getAttribute("checkCode").equals(checkCode)) {
                String result = userService.validateLogon(id, password);
                if(result.equals("ok")) {
                    User user = userService.getUser(id);
                    session.setAttribute("user", user);
                }
                return userService.validateLogon(id, password);
            } else {
                return "验证码错误！";
            }
        }
//        return userService.validateLogon(id, password);
    }

    /*
    * 获取登录用户信息
    * */
    @PostMapping(value = "/get_user")
//    @GetMapping(value = "/get_user")
    @ResponseBody
    public String getUser(HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
            return "error:用户没有登录！";
        } else {
            User user = (User)session.getAttribute("user");
            return user.toString();
        }
    }

    /**
     * 退出登录
     * @param request
     * @return
     */
    @RequestMapping(value = "/sign_out")
    @ResponseBody
    public String signOut(HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            String result = vncService.closeUserVNC(user.getId());
            if(result.equals("ok")) {
                session.setAttribute("user", null);
            }
            return result;
        }
//        session.setAttribute("user", null);
//        return "ok";
    }

    @PostMapping(value = "/keep_user_connection")
    @ResponseBody
    public String keepUserConnection(HttpServletRequest request) {

        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
            return "error";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return "ok";
        }
    }

    @PostMapping(value = "/get_teacher_info")
    @ResponseBody
    public String getTeacherInfo(@RequestParam("teacherId") String teacherId, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") != null) {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        }
        return userService.getUser(teacherId).toString();
    }

    @PostMapping(value = "/reset_password")
    @ResponseBody
    public String resetPassword(@RequestParam("id") String id, @RequestParam("name") String name, @RequestParam("email") String email, @RequestParam("tel") String tel, @RequestParam("newPassword") String newPassword, @RequestParam("repeatPassword") String repeatPassword) {
        return userService.resetPassword(id, name, email, tel, newPassword, repeatPassword);
    }

    @PostMapping(value = "/add_user")
    @ResponseBody
    public String addUser(@RequestParam("id") String id, @RequestParam("name") String name, @RequestParam("sex") String sex, @RequestParam("email") String email, @RequestParam("tel") String tel, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return userService.addUser(id, name, sex, email, tel, user);
        }
    }

    @PostMapping(value = "/change_password")
    @ResponseBody
    public String changePassword(@RequestParam("oldPassword") String oldPassword, @RequestParam("newPassword") String newPassword, @RequestParam("confirmPassword") String confirmPassword, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return userService.changePassword(oldPassword, newPassword, confirmPassword, user);
        }
    }

    @PostMapping(value = "/change_user_information")
    @ResponseBody
    public String changeUserInformation(@RequestParam("userPassword") String userPassword, @RequestParam("userName") String userName, @RequestParam("userSex") String userSex, @RequestParam("userTel") String userTel, @RequestParam("userEmail") String userEmail, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (session.getAttribute("user") == null) {
            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return userService.changeUserInformation(userPassword, userName, userSex, userTel, userEmail, user);
        }
    }
}

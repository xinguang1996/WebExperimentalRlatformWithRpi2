package com.gxg.services;

import com.gxg.dao.UserDao;
import com.gxg.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Created by 郭欣光 on 2017/12/27.
 *
 */


@Service
public class UserService {


    @Autowired
    private UserDao userDao;

    @Autowired
    private MD5Service md5Service;

    @Value("${user.default.password}")
    private String userDefaultPassword;

    @Autowired
    private CheckEmailService checkEmailService;

    @Autowired
    private CheckTelephoneService checkTelephoneService;

    /*
    * 该方法用于验证用户是否合法
    * */
    public String validateLogon(String id, String password) {

        if(userDao.isUser(id)) {
            User user = new User();
            user = userDao.getUser(id);
            if(user == null) {
                return "用户账号不存在！";
            } else {
                if(md5Service.md5(password) == null) {
                    return "系统进行密码验证加密时出错，导致验证不成功！";
                } else {
                    if(user.getPassword().equals(md5Service.md5(password))) {
                        return "ok";
                    } else {
                        return "密码错误！";
                    }
                }
            }
        } else {
            return "用户账号不存在！";
        }
    }

    /*
    * 获得用户信息
    * */
    public User getUser(String id) {
        User user = new User();
        user = userDao.getUser(id);
        return user;
    }

    public String resetPassword(String id, String name, String email, String tel, String newPassword, String repeatPassword) {
        User user = this.getUser(id);
        if (id == null || id.equals("") || id.length() == 0 || name == null || name.equals("") || name.length() == 0 || email == null || email.equals("") || email.length() == 0 || tel == null || tel.equals("") || tel.length() == 0 || newPassword == null || newPassword.equals("") || newPassword.length() == 0 || repeatPassword == null || repeatPassword.equals("") || repeatPassword.length() == 0) {
            return "所有字段不能为空！";
        }  else {
            if (user != null) {
                if (newPassword.equals(repeatPassword)) {
                    if (user.getName().equals(name)) {
                        if (user.getEmail().equals(email)) {
                            if (user.getTel().equals(tel)) {
                                String password = md5Service.md5(newPassword);
                                try {
                                    userDao.updatePasswordById(password, id);
                                    return "ok！";
                                } catch (Exception e) {
                                    System.out.println(e.getMessage());
                                    return "更新密码时操作数据库发生异常！";
                                }
                            } else {
                                return "电话验证不通过！";
                            }
                        } else {
                            return "电子邮箱验证不通过！";
                        }
                    } else {
                        return "姓名验证不通过！";
                    }
                } else {
                    return "两次密码不一致！";
                }
            } else {
                return "没有该用户！";
            }
        }
    }

    public String addUser(String id, String name, String sex, String email, String tel, User user) {
        if (user.getRole().equals("教师")) {
            if (id == null || id.equals("") || id.length() == 0 || name == null || name.equals("") || name.length() == 0 || sex == null || sex.equals("") || sex.length() == 0 || email == null || email.equals("") || email.length() == 0 || tel == null || tel.equals("") || tel.length() == 0) {
                return "所有字段不能为空！";
            } else {
                if (id.length() > 8) {
                    return "账户长度不能大于8！";
                }
                if (name.length() > 30) {
                    return "姓名程度不能大于30！";
                }
                if (!sex.equals("男") && !sex.equals("女")) {
                    return "性别不合要求！";
                }
                if (email.length() > 50) {
                    return "电子邮箱长度不能超过50！";
                }
                if (!checkEmailService.checkEmail(email)) {
                    return "电子邮箱的格式不正确！";
                }
                if (!checkTelephoneService.checkTelephone(tel)) {
                    return "不是正确的大陆手机格式！";
                }
                if (userDao.isUser(id)) {
                    return "账号已经被使用！";
                }
                User user1 = new User();
                user1.setId(id);
                user1.setName(name);
                user1.setSex(sex);
                user1.setEmail(email);
                user1.setTel(tel);
                user1.setRole("教师");
                String password = md5Service.md5(userDefaultPassword);
                user1.setPassword(password);
                try {
                    userDao.insertUser(user1);
                    return "userId:" + user1.getId() + "userDefaultPassword:" + userDefaultPassword;
                } catch (Exception e) {
                    System.out.println(e.getMessage());
                    return "添加用户时操作数据库出错！";
                }
            }
        } else {
            return "抱歉，您的身份是" + user.getRole() + "，仅有教师可以添加用户！";
        }
    }

    public String changePassword(String oldPassword, String newPassword, String confirmPassword, User user) {
        if (oldPassword == null || oldPassword.equals("") || oldPassword.length() == 0 || newPassword == null || newPassword.equals("") || newPassword.length() == 0 || confirmPassword == null || confirmPassword.equals("") || confirmPassword.length() == 0) {
            return "所有字段不能为空！";
        }
        if (user.getPassword().equals(md5Service.md5(oldPassword))) {
            if (newPassword.equals(confirmPassword)) {
                String newPasswordMd5 = md5Service.md5(newPassword);
                try {
                    userDao.updatePasswordById(newPasswordMd5, user.getId());
                    return "ok";
                } catch (Exception e) {
                    System.out.print(e.getMessage());
                    return "修改密码失败！操作数据库异常！";
                }
            } else {
                return "两次密码不一致！";
            }
        } else {
            return "密码错误！";
        }
    }

    public String changeUserInformation(String userPassword, String userName, String userSex, String userTel, String userEmail, User user) {
        if (userPassword == null || userPassword.equals("") || userPassword.length() == 0 || userName == null || userName.equals("") || userName.length() == 0 || userSex == null || userSex.equals("") || userSex.length() == 0 || userTel == null || userTel.equals("") || userTel.length() == 0 || userEmail == null || userEmail.equals("") || userEmail.length() == 0) {
            return "所有字段不能为空！";
        }
        if (userName.length() > 30) {
            return "姓名长度不能大于30！";
        }
        if (!userSex.equals("男") && !userSex.equals("女")) {
            return "性别类型不正确！";
        }
        if (!checkTelephoneService.checkTelephone(userTel)) {
            return "不是有效的电话号码！";
        }
        if (!checkEmailService.checkEmail(userEmail)) {
            return "不是有效的邮箱！";
        }
        if (md5Service.md5(userPassword).equals(user.getPassword())) {
            user.setName(userName);
            user.setTel(userTel);
            user.setSex(userSex);
            user.setTel(userTel);
            user.setEmail(userEmail);
            try {
                userDao.updateUserById(user);
                return "ok";
            } catch (Exception e) {
                return "操作数据库失败！";
            }
        } else {
            return "密码错误！";
        }
    }
}
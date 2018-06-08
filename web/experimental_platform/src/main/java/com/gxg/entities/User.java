package com.gxg.entities;

import org.hibernate.validator.constraints.Length;
import org.json.JSONObject;
import org.springframework.lang.NonNull;

import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

/**
 * Created by 郭欣光 on 2017/12/27.
 */

/*
    用于存储用户的信息
 */
public class User {

    private String id;//用户账号
    private String password;//用户密码
    private String name;//用户姓名
    private String sex;//用户性别
    @Email
    private String email;//用户邮箱
    @Size(min = 11, max = 11)
    private String tel;//用户电话
    private String role;//用户身份

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @Override
    public String toString() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.accumulate("id", this.id);
        jsonObject.accumulate("password", this.password);
        jsonObject.accumulate("sex", this.sex);
        jsonObject.accumulate("name", this.name);
        jsonObject.accumulate("tel", this.tel);
        jsonObject.accumulate("email", this.email);
        jsonObject.accumulate("role", this.role);
        return jsonObject.toString();
    }
}

package com.gxg.entities;

import org.json.JSONObject;

import java.sql.Timestamp;

/**
 * Created by 郭欣光 on 2018/3/14.
 */

public class ExperimentalEnvironment {
    private String id;
    private String name;
    private String status;
    private String course;
    private double size;
    private Timestamp createTime;

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public double getSize() {
        return size;
    }

    public void setSize(double size) {
        this.size = size;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    @Override
    public String toString() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.accumulate("id", this.id);
        jsonObject.accumulate("name", this.name);
        jsonObject.accumulate("status", this.status);
        jsonObject.accumulate("course", this.course);
        jsonObject.accumulate("size", this.size);
        jsonObject.accumulate("createTime", this.createTime);
        return jsonObject.toString();
    }
}

package com.gxg.entities;

import org.json.JSONObject;

import java.sql.Timestamp;

/**
 * Created by 郭欣光 on 2018/1/11.
 */

public class ExperimentalDocument {

    private String id;
    private String title;
    private String name;
    private String courseId;
    private Timestamp createTime;
    private Timestamp modificationTime;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    public Timestamp getModificationTime() {
        return modificationTime;
    }

    public void setModificationTime(Timestamp modificationTime) {
        this.modificationTime = modificationTime;
    }

    @Override
    public String toString() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.accumulate("id", this.id);
        jsonObject.accumulate("title", this.title);
        jsonObject.accumulate("name", this.name);
        jsonObject.accumulate("courseId", this.courseId);
        jsonObject.accumulate("createTime", this.createTime);
        jsonObject.accumulate("modificationTime", this.modificationTime);
        return jsonObject.toString();
    }
}

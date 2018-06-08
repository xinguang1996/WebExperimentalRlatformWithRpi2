package com.gxg.entities;

import org.json.JSONObject;

import javax.validation.constraints.Size;
import java.sql.Timestamp;

/**
 * Created by 郭欣光 on 2018/1/5.
 */

public class Course {

    @Size(min = 22, max = 22)
    private String id ;
    private String name;
    private String tab;
    private String description;
    private String img;
    @Size(min = 8, max = 8)
    private String teacher;
    private Timestamp createTime;
    private Timestamp modificationTime;

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

    public String getTab() {
        return tab;
    }

    public void setTab(String tab) {
        this.tab = tab;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public String getTeacher() {
        return teacher;
    }

    public void setTeacher(String teacher) {
        this.teacher = teacher;
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
        jsonObject.accumulate("name", this.name);
        jsonObject.accumulate("tab", this.tab);
        jsonObject.accumulate("description", this.description);
        jsonObject.accumulate("img", this.img);
        jsonObject.accumulate("teacher", this.teacher);
        jsonObject.accumulate("createTime", this.createTime);
        jsonObject.accumulate("modificationTime", this.modificationTime);
        return jsonObject.toString();
    }
}

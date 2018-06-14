package com.gxg.entities;

import java.sql.Timestamp;

/**
 * Created by 郭欣光 on 2018/6/8.
 */

public class NodeGroup {

    private int groupNumber;
    private String userIp;
    private Timestamp time;

    public int getGroupNumber() {
        return groupNumber;
    }

    public void setGroupNumber(int groupNumber) {
        this.groupNumber = groupNumber;
    }

    public String getUserIp() {
        return userIp;
    }

    public void setUserIp(String userIp) {
        this.userIp = userIp;
    }

    public Timestamp getTime() {
        return time;
    }

    public void setTime(Timestamp time) {
        this.time = time;
    }
}

package com.gxg.entities;

import java.util.ArrayList;

/**
 * Created by 郭欣光 on 2018/1/9.
 */
public class ExperimentalImageUploadResult {
    private int errno;
    private ArrayList<String> data;

    public int getErrno() {
        return errno;
    }

    public void setErrno(int errno) {
        this.errno = errno;
    }

    public ArrayList<String> getData() {
        return data;
    }

    public void setData(ArrayList<String> data) {
        this.data = data;
    }
}

package com.gxg.services;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.tomcat.jni.Socket;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.SocketException;

/**
 * Created by 郭欣光 on 2018/3/15.
 */

@Service
public class FtpService {

    public String ftpSendFile(String sourceDirectory, String destinationDirectory, String ip, String username, String password) {
        //创建客户端对象
        FTPClient ftp = new FTPClient();
        InputStream local = null;
        try {
            //连接ftp服务器
            ftp.connect(ip, 21);
            //登录
            ftp.login(username, password);
            //检查上传路径是否存在 如果不存在返回false
            Boolean flag = ftp.changeWorkingDirectory(destinationDirectory);
            if(!flag) {
                //创建上传路径 该方法只能创建一级目录
                ftp.makeDirectory(destinationDirectory);
            }
            //指定上传路径
            ftp.changeWorkingDirectory(destinationDirectory);
            //指定上传文件的类型 二进制文件
            ftp.setFileType(FTP.BINARY_FILE_TYPE);
            //读取本地文件
            File file = new File(sourceDirectory);
            local = new FileInputStream(file);
            //第一个参数是文件名
            ftp.storeFile(file.getName(), local);
            return "ok";
        } catch (SocketException e) {
            e.printStackTrace();
            return "ftp传输文件时产生异常：" + e.getMessage();
        } catch (IOException e) {
            e.printStackTrace();
            return "ftp传输文件时产生异常：" + e.getMessage();
        } catch (Exception e) {
            e.printStackTrace();
            return "ftp传输文件时产生异常：" + e.getMessage();
        } finally {
            try{
                //关闭文件流
                local.close();
                //退出
                ftp.logout();
                //断开连接
                ftp.disconnect();
            } catch (IOException e) {
                e.printStackTrace();
                return "ftp传输文件时产生异常：" + e.getMessage();
            }
        }
    }
}

package com.gxg.services;

import com.jcraft.jsch.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Properties;

/**
 * Created by 郭欣光 on 2018/3/16.
 */

@Service
public class SftpService {

    @Value("${sftp.session.timeout}")
    private int sessionTimeout;

    /**
     * 创建连接
     * @param username sftp服务器用户名
     * @param password sftp服务器密码
     * @param host sftp服务器IP
     * @param port sftp服务器端口号
     * @return
     */
//    public List<Object> connect(String username, String password, String host, Integer port) {
//        ChannelSftp sftp = null;
//        try {
//            JSch jSch = new JSch();
//            sshSession = jSch.getSession(username, host, port.intValue());
//            sshSession.setPassword(password);
//            Properties sshConfig = new Properties();
//            sshConfig.put("StrictHostKeyChecking", "no");
//            sshSession.setConfig(sshConfig);
//            sshSession.setTimeout(sessionTimeout);
//            sshSession.connect();
//            Channel channel = sshSession.openChannel("sftp");
//            channel.connect();
//            sftp = (ChannelSftp)channel;
//        } catch (Exception e) {
//            e.printStackTrace();
//            return null;
//        }
//        return sftp;
//    }

    /**
     * sftp上传单个文件
     * @param destinationDirectory 目的服务器的上传目录
     * @param sourceDirectory 本地文件目录
     * @param fileName 上传文件的文件名
     * @param username 用于sftp连接的用户名
     * @param password 用于sftp连接的密码
     * @param host sftp连接的主机ip
     * @param port sftp连接主机的端口号
     * @return
     */
    public String uploadFile(String destinationDirectory, String sourceDirectory, String fileName, String username, String password, String host, int port) {
        FileInputStream in = null;
        ChannelSftp sftp = null;
        Session sshSession = null;
        try {
            JSch jSch = new JSch();
            sshSession = jSch.getSession(username, host, port);
            sshSession.setPassword(password);
            Properties sshConfig = new Properties();
            sshConfig.put("StrictHostKeyChecking", "no");
            sshSession.setConfig(sshConfig);
            sshSession.setTimeout(sessionTimeout);
            sshSession.connect();
            Channel channel = sshSession.openChannel("sftp");
            channel.connect();
            sftp = (ChannelSftp)channel;
        } catch (Exception e) {
//            e.printStackTrace();
            return "连接sftp时出错：" + e.getMessage();
        }
//        ChannelSftp sftp = this.connect(username, password, host, port);
        if(sftp == null) {
            return "连接sftp时出错！";
        }
        try {
            java.util.Vector content = sftp.ls(destinationDirectory);
            if(content == null) {
                sftp.mkdir(destinationDirectory);
            }
            sftp.cd(destinationDirectory);
        } catch (SftpException e) {
            try {
                sftp.mkdir(destinationDirectory);
                sftp.cd(destinationDirectory);
            } catch (SftpException e1) {
                return "ftp创建文件路径失败！路径为：" + destinationDirectory;
            }
        }
        File file = new File(sourceDirectory);
        try {
            in = new FileInputStream(file);
            sftp.put(in, fileName);
        } catch (FileNotFoundException e) {
//            e.printStackTrace();
            return "文件不存在：" + sourceDirectory;
        } catch (SftpException e) {
//            e.printStackTrace();
            return "sftp异常：" + e.getMessage();
        } finally {
            if(in != null) {
                try {
                    in.close();
                } catch (IOException e) {
//                    e.printStackTrace();
                    return "关闭文件流出错：" + e.getMessage();
                }
            }
            if(sftp != null) {
                if(sftp.isConnected()) {
                    sftp.disconnect();
                }
            }
            if(sshSession != null) {
                if(sshSession.isConnected()) {
                    sshSession.disconnect();
                    sshSession = null;
                }
            }
        }
        return "ok";
    }

    /**
     * 关闭连接
     * @param sftp ChannelSftp对象
     */
//    public void disconnect(ChannelSftp sftp) {
//        if(sftp != null) {
//            if(sftp.isConnected()) {
//                sftp.disconnect();
//            }
//        }
//        if(this.sshSession != null) {
//            if(this.sshSession.isConnected()) {
//                this.sshSession.disconnect();
//                this.sshSession = null;
//            }
//        }
//    }
}

package com.gxg.services;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

/**
 * Created by 郭欣光 on 2018/1/20.
 */

@Service
public class FileService {

    public String deleteFile(String filePath) {
        File file = new File(filePath);
        if(file.exists() && file.isFile()) {
            if(file.delete()) {
                return "ok";
            } else {
                return "删除文件失败！";
            }
        } else {
            return "删除文件失败：文件不存在！";
        }
    }

    public String writeFile(String path, String name, String content) {
        try {
            File fileDir = new File(path);
            if(!fileDir.exists()) {
                fileDir.mkdirs();
            }
            File file = new File(path + name);
            FileOutputStream fileOutputStream = new FileOutputStream(file);
            byte by[] = content.getBytes();
            fileOutputStream.write(by);
            fileOutputStream.close();
            return "ok";
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return "写入文件出错：" + e.getMessage();
        } catch (IOException e) {
            e.printStackTrace();
            return "写入文件出错：" + e.getMessage();
        }
    }

    public String uploadFile(MultipartFile file, String name, String path) {
        if(file.isEmpty()) {
            return "文件为空！";
        } else {
            try {
                File uploadFilePath = new File(path);
                if (!uploadFilePath.exists()) {
                    uploadFilePath.mkdirs();
                }
                BufferedOutputStream outputStream = new BufferedOutputStream(new FileOutputStream(new File(path, name)));
                outputStream.write(file.getBytes());
                outputStream.flush();
                outputStream.close();
            } catch (FileNotFoundException e) {
//                e.printStackTrace();
                System.out.println(e.getMessage());
                return "上传文档失败：" + e.getMessage();
            } catch (IOException e) {
//                e.printStackTrace();
                System.out.println(e.getMessage());
                return "上传文档失败：" + e.getMessage();
            }
            return "ok";
        }
    }
}
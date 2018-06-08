package com.gxg.services;

import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Random;

/**
 * Created by 郭欣光 on 2017/12/28.
 */

@Service
public class CheckCodeService {

    public void createCheckCode(HttpServletRequest request, HttpServletResponse response) {

        //禁止浏览器缓存随机图片
        response.setDateHeader("Expires", -1);
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Pragma", "no-cache");

        //通知客户机以图片方式打开发送过去的数据
        response.setHeader("Content-Type", "image/jpeg");

        //在内存中创建一副图片
        BufferedImage image = new BufferedImage(80, 30,
                BufferedImage.TYPE_INT_RGB);

        //向图片上写数据
        Graphics g = image.getGraphics();

        //设背景色
        g.setColor(Color.WHITE);
        g.fillRect(0, 0, 80, 30);

        //设置写入数据的颜色和字体
        g.setColor(Color.BLACK);
        g.setFont(new Font(null, Font.BOLD, 20));

        //向图片上写数据
        String num = makeNum();
        request.getSession().setAttribute("checkCode", num);
        g.drawString(num, 0, 20);

        //把写好数据的图片输出给浏览器
        try {
            ImageIO.write(image, "jpg", response.getOutputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //该函数随机生成7为数字
    private String makeNum() {
        Random r = new Random();
        String num = r.nextInt(9999) + "";
        StringBuffer stringBuffer = new StringBuffer();
        for(int i = 0; i < 4 - num.length(); i++) {
            stringBuffer.append("0");
        }
        num = stringBuffer.toString() + num;
        return num;
    }
}

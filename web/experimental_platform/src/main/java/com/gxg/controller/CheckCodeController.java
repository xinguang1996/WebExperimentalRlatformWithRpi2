package com.gxg.controller;

import com.gxg.services.CheckCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by 郭欣光 on 2017/12/28.
 */

@Controller
public class CheckCodeController {


    @Autowired
    private CheckCodeService checkCodeService;
    @RequestMapping(value = "/get_check_code")
    public void getCheckCode(HttpServletRequest request, HttpServletResponse response) {
        //创建验证码并返回给浏览器
        checkCodeService.createCheckCode(request, response);
    }
}

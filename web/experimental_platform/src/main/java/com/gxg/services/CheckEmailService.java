package com.gxg.services;
import com.sun.org.apache.xpath.internal.operations.Bool;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by 郭欣光 on 2018/3/26.
 */
@Service
public class CheckEmailService {
    public Boolean checkEmail(String email) {
        String RULE_EMAIL = "^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$";
        //正则表达式的模式
        Pattern pattern = Pattern.compile(RULE_EMAIL);
        //正则表达式的匹配器
        Matcher matcher = pattern.matcher(email);
        //进行正则匹配
        return matcher.matches();
    }
}

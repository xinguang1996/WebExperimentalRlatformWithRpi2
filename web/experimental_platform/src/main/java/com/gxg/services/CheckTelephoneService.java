package com.gxg.services;

import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by 郭欣光 on 2018/3/26.
 */
@Service
public class CheckTelephoneService {
    public Boolean checkTelephone(String telephone) {
        String regex = "^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,1,2,3,5-9])|(177))\\d{8}$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(telephone);
        return matcher.matches();
    }
}

package com.gxg.configure;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Created by 郭欣光 on 2017/12/31.
 */

@Configuration
public class FileUrlConfig extends WebMvcConfigurerAdapter{

    @Value("${user.resources.url}")
    private String userResourcesUrl;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/user/**").addResourceLocations("file:" + userResourcesUrl);
    }
}

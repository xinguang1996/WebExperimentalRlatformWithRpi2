package com.gxg;

import com.gxg.dao.ExperimentalNodeDao;
import com.gxg.dao.NodeGroupDao;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.cache.CacheAutoConfiguration;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = CacheAutoConfiguration.class)
@EnableScheduling  //启动定时任务
public class ExperimentalPlatformApplication {

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(ExperimentalPlatformApplication.class, args);
		Boolean deleteContinue = true;
		while (deleteContinue) {
			try {
				context.getBean(ExperimentalNodeDao.class).deleteAll();
				context.getBean(NodeGroupDao.class).deleteAll();
				deleteContinue = false;
			} catch (Exception e) {
				System.out.println(e.getMessage());
			}
		}
	}
}

package com.gxg.task;

import com.gxg.services.VNCService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * 该类用于设置某些运行定时任务
 * Created by 郭欣光 on 2017/12/31.
 */
@Component
public class TimedTask {

    @Autowired
    private VNCService vncService;

    /**
     * 定时检查是否有用户使用vnc节点
     */
    @Scheduled(fixedRate = 10000)
    public void checkVNCNodeUsed() {
        vncService.checkVNCNodeUsed();
    }

    /**
     * 定时检查节点是否正常连接
     */
    @Scheduled(fixedRate = 2000)
    public void checkNodeExist() {
        vncService.checkNodeExist();
    }
}

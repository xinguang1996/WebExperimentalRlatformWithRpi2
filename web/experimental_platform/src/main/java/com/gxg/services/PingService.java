package com.gxg.services;

import com.gxg.dao.ExperimentalNodeDao;
import com.gxg.entities.ExperimentalNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.InetAddress;
import java.util.List;

/**
 * Created by 郭欣光 on 2018/4/13.
 */

@Service
public class PingService {
    @Value("${ping.timeout}")
    private int pingTimeout;

    public Boolean ping(String ipAddress) throws Exception {
        return InetAddress.getByName(ipAddress).isReachable(pingTimeout);
    }
}

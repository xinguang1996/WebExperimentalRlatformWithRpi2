package com.gxg.services;

import com.gxg.dao.ExperimentalNodeDao;
import com.gxg.dao.NodeCountDao;
import com.gxg.dao.NodeGroupDao;
import com.gxg.entities.ExperimentalNode;
import com.gxg.entities.NodeGroup;
import com.gxg.entities.User;
import com.sun.org.apache.xpath.internal.operations.Bool;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import javax.xml.soap.Node;
import java.io.*;
import java.net.Socket;
import java.sql.Timestamp;
import java.util.List;

/**
 * Created by 郭欣光 on 2017/12/28.
 */

@Service
public class VNCService {

    @Value("${vnc.port}")
    private int port;

    @Value("${vnc.closed.time}")
    private int closedSeconds; //多少秒不使用时自动关闭

    @Autowired
    private ExperimentalNodeDao experimentalNodeDao;

    @Autowired
    private IpService ipService;

    @Autowired
    private PingService pingService;

    @Autowired
    private NodeCountDao nodeCountDao;

    @Autowired
    private NodeGroupDao nodeGroupDao;

    /**
     * 发送启动vnc的socket信号
     * @param ip
     * @param screenSize
     * @return
     */
    public String startVNC(String ip, String screenSize) {
        try {
            //创建一个套接字并将其连接到指定主机的指定端口
            Socket socket = new Socket(ip, port);

            OutputStream outputStream = socket.getOutputStream();//获取一个输出流，向服务器发送信息
            PrintWriter printWriter = new PrintWriter(outputStream);//将输出流包装成打印流
            printWriter.print("start:" + screenSize);
            printWriter.flush();
            socket.shutdownOutput();//关闭输出流

            InputStream inputStream = socket.getInputStream();//获取一个输入流，接收服务器的信息
            byte[] buf = new byte[1024];
            int len = inputStream.read(buf);
            String info = new String(buf,0,len);
            //关闭相对应的资源
            inputStream.close();
            printWriter.close();
            outputStream.close();
            socket.close();
            if(info.equals("ok")) {
                return "ok:" + ip;
            } else {
                System.out.println(info);
                try {
                    experimentalNodeDao.updateStatusByIp(ip, "错误");
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    return "开启VNC服务出错！";
                }
            }
        } catch (Exception e) {
            try {
                experimentalNodeDao.updateStatusByIp(ip, "错误");
            } catch (Exception e2) {
                e2.printStackTrace();
            } finally {
                return "向节点发送请求开启VNC服务时出现异常：" + e.getMessage();
            }
        }

    }

    /**
     * 发送关闭vnc的socket信号
     * @param ip
     * @return
     */
    public String stopVNC(String ip) {
        try{
            //创建一个套接字并将其连接到指定主机的指定端口
            Socket socket = new Socket(ip, port);

            OutputStream outputStream = socket.getOutputStream();//获取一个输出流，向服务器发送信息
            PrintWriter printWriter = new PrintWriter(outputStream);//将输出流包装成打印流
            printWriter.print("stop:vnc");
            printWriter.flush();
            socket.shutdownOutput();//关闭输出流

            InputStream inputStream = socket.getInputStream();//获取一个输入流，接收服务器的信息
            byte[] buf = new byte[1024];
            int len = inputStream.read(buf);
            String info = new String(buf,0,len);
            //关闭相对应的资源
            inputStream.close();
            printWriter.close();
            outputStream.close();
            socket.close();
            if(info.equals("ok")) {
                return "ok";
            } else {
                try {
                    experimentalNodeDao.updateStatusByIp(ip, "错误");
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    return "关闭VNC服务出错！";
                }
            }
        } catch (Exception e) {
            try {
                experimentalNodeDao.updateStatusByIp(ip, "错误");
            } catch (Exception e2) {
                e2.printStackTrace();
            } finally {
                return "向节点发送请求关闭VNC服务时出现异常：" + e.getMessage();
            }
        }
    }

    public synchronized String getOneFreeExperimentalNode(HttpServletRequest request, String screenSize) {
        String clientIp = ipService.getIpAddr(request);
        if (clientIp.equals("") || clientIp == null) {
            return "未正确获得客户端IP！";
        } else {
            String userId = clientIp.substring(clientIp.lastIndexOf(".") + 1, clientIp.length());
            if (nodeGroupDao.getCountByUserIp(clientIp) == 0) {
                return "没有空余的节点，请稍后再次连接！";
            } else {
                List<ExperimentalNode> experimentalNodeList = experimentalNodeDao.getNodeByUserId(userId);
                if (experimentalNodeList == null) {
                    NodeGroup nodeGroup = nodeGroupDao.getNodeGroupByUserIp(clientIp);
                    if (experimentalNodeDao.getCountByGroupNumberAndStatus(nodeGroup.getGroupNumber(), "正常") == 0) {
                        return "没有空余的节点，请稍后再次连接！";
                    } else {
                        List<ExperimentalNode> userGroupExperimentalNodeList = experimentalNodeDao.getExperimentalNodeByGroupNumberAndStatusOrderByIp(nodeGroup.getGroupNumber(), "正常");
                        ExperimentalNode experimentalNode = userGroupExperimentalNodeList.get(0);
                        String ip = experimentalNode.getIp();
                        String result = this.startVNC(ip, screenSize);
                        if (result.indexOf("ok:") == 0) {
                            try {
                                experimentalNodeDao.increaseNodeUser(ip, userId);
                            } catch (Exception e) {
                                String stopVNCResult = this.stopVNC(ip);
                                System.out.println(stopVNCResult);
                                return "操作打开vnc服务时数据库出错！";
                            }
                            return result;
                        }
                        return result;
                    }
                } else {
                    ExperimentalNode experimentalNode = experimentalNodeList.get(0);
                    String ip = experimentalNode.getIp();
                    try {
                        experimentalNodeDao.updateNodeTime(ip);
                    } catch (Exception e) {
//                    e.printStackTrace();
                        System.out.println(e.getMessage());
                    } finally {
                        return "ok:" + ip;
                    }
                }
            }
//            List<ExperimentalNode> experimentalNodeList = experimentalNodeDao.getNodeByUserId(userId);
//            if (experimentalNodeList == null) {
//                synchronized (this) {
//                    experimentalNodeList = experimentalNodeDao.getFreeNode();
//                    if (experimentalNodeList == null) {
//                        return "没有空余的节点，请稍后再次连接！";
//                    } else {
//                        ExperimentalNode experimentalNode = experimentalNodeList.get(0);
//                        String ip = experimentalNode.getIp();
//                        String result = this.startVNC(ip, screenSize);
//                        if (result.indexOf("ok:") == 0) {
//                            try {
//                                experimentalNodeDao.increaseNodeUser(ip, userId);
//                            } catch (Exception e) {
//                                String stopVNCResult = this.stopVNC(ip);
//                                System.out.println(stopVNCResult);
//                                return "操作打开vnc服务时数据库出错！";
//                            }
//                            return result;
//                        }
//                        return result;
////                experimentalNodeDao.increaseNodeUser(ip, userId);
////                return this.startVNC(ip, screenSize);
//                    }
//                }
//            } else {
//                ExperimentalNode experimentalNode = experimentalNodeList.get(0);
//                String ip = experimentalNode.getIp();
//                try {
//                    experimentalNodeDao.updateNodeTime(ip);
//                } catch (Exception e) {
////                    e.printStackTrace();
//                    System.out.println(e.getMessage());
//                } finally {
//                    return "ok:" + ip;
//                }
//            }
        }
//        List<ExperimentalNode> experimentalNodeList = experimentalNodeDao.getFreeNode();
//        if(experimentalNodeList == null) {
//            return "没有空余的节点，请稍后再次连接！";
//        } else {
//            ExperimentalNode experimentalNode = new ExperimentalNode();
//            experimentalNode = experimentalNodeList.get(0);
//            String ip = experimentalNode.getIp();
//            experimentalNodeDao.increaseNodeUser(ip, userId);
//            return this.startVNC(ip, screenSize);
//        }
    }

    public void updateNodeTime(HttpServletRequest request) {
//        experimentalNodeDao.updateNodeTime(id);
        String clientIp = ipService.getIpAddr(request);
        if (!clientIp.equals("") && clientIp != null) {
            String id = clientIp.substring(clientIp.lastIndexOf(".") + 1, clientIp.length());
            try {
                nodeGroupDao.updateTimeByUserIp(clientIp);
                experimentalNodeDao.updateNodeTimeByUserId(id);
            } catch (Exception e) {
//                e.printStackTrace();
                System.out.println(e.getMessage());
            }
        }
    }


    /**
     * 关闭用户所有的vnc
     * @param userId
     * @return
     */
    public String closeUserVNC(String userId) {
        List<ExperimentalNode> experimentalNodeList = experimentalNodeDao.getNodeByUserId(userId);
        if(experimentalNodeList != null) {
            for(ExperimentalNode experimentalNode : experimentalNodeList) {
                String result = this.stopVNC(experimentalNode.getIp());
                if(result.equals("ok")) {
                    try {
                        experimentalNodeDao.setUserIdAndTimeNullByIp(experimentalNode.getIp());
                        nodeGroupDao.setUserIpAndTimeNullByGroupNumber(experimentalNode.getGroupNumber());
                        return "ok";
                    } catch (Exception e) {
                        System.out.println(e.getMessage());
                        try {
                            experimentalNodeDao.updateStatusByIp(experimentalNode.getIp(), "错误");
                        } catch (Exception e2) {
//                            e2.printStackTrace();
                            System.out.println(e2.getMessage());
                        } finally {
                            return "操作数据库出错：" + e.getMessage();
                        }
                    }
                } else {
                    return result + " ip:" + experimentalNode.getIp();
                }
            }
        }
        return "ok";
    }

    /**
     * 检查VNCNode是否正在被使用
     */
    public void checkVNCNodeUsed() {
        System.out.println("Being checked...");
        if (nodeGroupDao.getCountByUserIpNotNull() == 0) {
            System.out.println("No vnc node is using...");
        } else {
            List<NodeGroup> nodeGroupList = nodeGroupDao.getNodeGroupByUserIpNotNull();
            for (NodeGroup nodeGroup : nodeGroupList) {
                Timestamp time = nodeGroup.getTime();
                Timestamp nowTime = new Timestamp(System.currentTimeMillis());
                //判断当前分组用户是否还在使用
                if (nowTime.getTime() - time.getTime() >= this.closedSeconds * 1000) {
                    System.out.println("Group number " + nodeGroup.getGroupNumber() + " is checking...");
                    if (experimentalNodeDao.getCountByGroupNumber(nodeGroup.getGroupNumber()) == 0) {
                        System.out.println("No vnc node in group number " + nodeGroup.getGroupNumber());
                    } else {
                        boolean isRunning = false;
                        List<ExperimentalNode> experimentalNodeList = experimentalNodeDao.getExperimentalNodeByGroupNumber(nodeGroup.getGroupNumber());
                        for (ExperimentalNode experimentalNode : experimentalNodeList) {
                            if (experimentalNode.getUserId() != null) {
                                isRunning = true;
                                System.out.println(experimentalNode.getIp() + " on group number " + nodeGroup.getGroupNumber() + " is closing...");
                                String result = this.stopVNC(experimentalNode.getIp());
                                if(result.equals("ok")) {
                                    try {
                                        experimentalNodeDao.setUserIdAndTimeNullByIp(experimentalNode.getIp());
                                        System.out.println(experimentalNode.getIp() + " on group number " + nodeGroup.getGroupNumber() + " close off success");
                                    } catch (Exception e) {
                                        try {
                                            experimentalNodeDao.updateStatusByIp(experimentalNode.getIp(), "错误");
                                        } catch (Exception e2) {
                                            e2.printStackTrace();
                                        }
                                        e.printStackTrace();
                                    }
                                } else {
                                    System.out.println(experimentalNode.getIp() + " on group number " + nodeGroup + " failure to shut down");
                                    System.out.println(result);
                                    try {
                                        experimentalNodeDao.updateStatusByIp(experimentalNode.getIp(), "错误");
                                    } catch (Exception e) {
                                        e.printStackTrace();
                                    } finally {
                                        continue;
                                    }
                                }
                            } else {
                                System.out.println(experimentalNode.getIp() + " on group number " + nodeGroup.getGroupNumber() + " is running...");
                            }
                        }
                        if (!isRunning) {
                            System.out.println("No vnc node in group number " + nodeGroup.getGroupNumber());
                        }
                    }
                    try {
                        nodeGroupDao.setUserIpAndTimeNullByGroupNumber(nodeGroup.getGroupNumber());
                    } catch (Exception e) {
                        System.out.println(e);
                        System.out.println("Group number " + nodeGroup.getGroupNumber() + " is failure to set null");
                    }
                    System.out.println("Group number " + nodeGroup.getGroupNumber() + " check end");
                }
            }
        }
//        List<ExperimentalNode> experimentalNodeList = experimentalNodeDao.getNodeByUserIdAndTimeNotNull();
//        if(experimentalNodeList == null) {
//            System.out.println("No vnc node is using...");
//        } else {
//            for (ExperimentalNode experimentalNode : experimentalNodeList) {
//                Timestamp time = experimentalNode.getDatetime();
//                Timestamp nowTime = new Timestamp(System.currentTimeMillis());
//                //判断当前节点用户是否还在使用
//                if(nowTime.getTime() - time.getTime() >= this.closedSeconds * 1000) {
//                    System.out.println(experimentalNode.getIp() + ": is closing...");
//                    String result = this.stopVNC(experimentalNode.getIp());
//                    if(result.equals("ok")) {
//                        try {
//                            experimentalNodeDao.setUserIdAndTimeNullByIp(experimentalNode.getIp());
//                            System.out.println(experimentalNode.getIp() + ": close off success");
//                        } catch (Exception e) {
//                            try {
//                                experimentalNodeDao.updateStatusByIp(experimentalNode.getIp(), "错误");
//                            } catch (Exception e2) {
//                                e2.printStackTrace();
//                            }
//                            e.printStackTrace();
//                        }
//                    } else {
//                        System.out.println(experimentalNode.getIp() + ": failure to shut down");
//                        System.out.println(result);
//                        try {
//                            experimentalNodeDao.updateStatusByIp(experimentalNode.getIp(), "错误");
//                        } catch (Exception e) {
//                            e.printStackTrace();
//                        } finally {
//                            continue;
//                        }
//                    }
//                } else {
//                    System.out.println(experimentalNode.getIp() + ": is running...");
//                }
//            }
//        }
        System.out.println("Check end!");
    }

    public String selectVNCNode(String ip, String screenSize, HttpServletRequest request) {
        String clientIp = ipService.getIpAddr(request);
        if (clientIp.equals("") || clientIp == null) {
            return "未正确获得客户端IP！";
        }
        String userId = clientIp.substring(clientIp.lastIndexOf(".") + 1, clientIp.length());
        String result = this.closeUserVNC(userId);
        if(result.equals("ok")) {
            synchronized (this) {
                if (experimentalNodeDao.getNodeCountUserIdNullByIp(ip) == 0) {
                    ExperimentalNode experimentalNode = experimentalNodeDao.getNodeByIp(ip);
                    return experimentalNode.getUserId() + "正在使用节点：" + experimentalNode.getIp();
                } else {
                    String startResult = this.startVNC(ip, screenSize);
                    if (startResult.indexOf("ok:") == 0) {
                        try {
                            experimentalNodeDao.increaseNodeUser(ip, userId);
                        } catch (Exception e) {
                            this.stopVNC(ip);
                            return "开启VNC服务时操作数据库失败！";
                        }
                    }
                    return startResult;
                }
            }
        } else {
            return result;
        }
    }

    public List<ExperimentalNode> getAllExperimentalNode() {
        List<ExperimentalNode> experimentalNodeList = experimentalNodeDao.getAllNodeOrderByIp();
        return experimentalNodeList;
    }

    public String getAllExperimentalNodeToJsonString() {
        if (experimentalNodeDao.getNodeCount() == 0) {
            return "暂无实验节点！";
        } else {
            List<ExperimentalNode> experimentalNodeList = this.getAllExperimentalNode();
            if (experimentalNodeList == null) {
                return "暂无实验节点！";
            } else {
                JSONObject jsonObject = new JSONObject();
                jsonObject.accumulate("experimentalNodeList", experimentalNodeList);
                return jsonObject.toString();
            }
        }
    }

    public synchronized String getAllAvailableExperimentalNodeToJsonString(HttpServletRequest request) {
        String clientIp = ipService.getIpAddr(request);
        if (clientIp.equals("") || clientIp == null) {
            return "未正确获得客户端IP！";
        } else {
//            String userId = clientIp.substring(clientIp.lastIndexOf(".") + 1, clientIp.length());
            NodeGroup nodeGroup = null;
            if (nodeGroupDao.getCountByUserIp(clientIp) == 0) {
                if (nodeGroupDao.getCountByUserIpIsNull() == 0) {
                    return "暂无实验节点！";
                } else {
                    List<NodeGroup> nodeGroupList = nodeGroupDao.getNodeGroupByUserIpIsNull();
                    nodeGroup = nodeGroupList.get(0);
                    try {
                        nodeGroupDao.setUserIpByGroupNumber(clientIp, nodeGroup.getGroupNumber());
                    } catch (Exception e) {
                        System.out.println(e);
                        return "暂无实验节点！";
                    }
                }
            } else {
                nodeGroup = nodeGroupDao.getNodeGroupByUserIp(clientIp);
            }
            if (nodeGroup != null) {
                if (experimentalNodeDao.getCountByGroupNumberAndStatus(nodeGroup.getGroupNumber(), "正常") == 0) {
                    return "暂无实验节点！";
                } else {
                    List<ExperimentalNode> experimentalNodeList = experimentalNodeDao.getExperimentalNodeByGroupNumberAndStatusOrderByIp(nodeGroup.getGroupNumber(), "正常");
                    if (experimentalNodeList == null) {
                        return "暂无实验节点！";
                    } else {
                        JSONObject jsonObject = new JSONObject();
                        jsonObject.accumulate("experimentalNodeList", experimentalNodeList);
                        return jsonObject.toString();
                    }
                }
            } else {
                return "暂无实验节点！";
            }
//            if (experimentalNodeDao.getAvailableNodeCountByUserId(userId) == 0) {
//                return "暂无实验节点！";
//            } else {
//                List<ExperimentalNode> experimentalNodeList = experimentalNodeDao.getAvailableNodeByUserIdOrderByIp(userId);
//                if (experimentalNodeList == null) {
//                    return "暂无实验节点！";
//                } else {
//                    JSONObject jsonObject = new JSONObject();
//                    jsonObject.accumulate("experimentalNodeList", experimentalNodeList);
//                    return jsonObject.toString();
//                }
//            }
        }
    }

    public String changeNodeStatus(String ip, String status, User user) {
        if (user.getRole().equals("教师")) {
            if (status == null || status.equals("") || status.length() == 0) {
                return "状态不能设置为空！";
            } else {
                if (status.equals("正常") || status.equals("错误")) {
                    try {
                        experimentalNodeDao.updateStatusByIp(ip, status);
                        return "ok";
                    } catch (Exception e) {
                        System.out.println(e.getMessage());
                        return "操作数据库出错导致设置失败！";
                    }
                } else {
                    return "状态设置不合法！";
                }
            }
        } else {
            return "抱歉，您的身份是" + user.getRole() + "，仅有教师可以设置节点！";
        }
    }

    public synchronized String getNodeExist(HttpServletRequest request) {
        String ip = ipService.getIpAddr(request);
        if (ip == null || "".equals(ip)) {
            System.out.println("A IP address that can not be identified");
            return "A IP address that can not be identified";
        } else {
            if (experimentalNodeDao.getNodeCountByIp(ip) == 0) {
//                    experimentalNodeDao.insertByIp(ip);
                if (nodeCountDao.getCount() == 0) {
                    try {
                        nodeCountDao.addNodeCount(1, 1);
                    } catch (Exception e) {
                        System.out.println(e);
                        return "Database error";
                    }
                }
                int nodeCountEachGroup = nodeCountDao.getNodeCount();
                int groupNumber = 1;
                while (true) {
                    if (experimentalNodeDao.getCountByGroupNumber(groupNumber) < nodeCountEachGroup) {
                        if (nodeGroupDao.getCountByGroupNumber(groupNumber) == 0) {
                            try {
                                nodeGroupDao.insertByGroupNumber(groupNumber);
                            } catch (Exception e) {
                                System.out.println(e);
                                return "Database error";
                            }
                        }
                        try {
                            experimentalNodeDao.insertByIpAndGroupNumber(ip, groupNumber);
                        } catch (Exception e) {
                            System.out.println(e);
                            return "Database error";
                        }
                        break;
                    } else {
                        groupNumber++;
                    }
                }
                System.out.println("record ok" + ip);
                return "record ok";
            } else {
                System.out.println("ok:" + ip);
                return "ok";
            }
        }
    }

    public void checkNodeExist() {
        System.out.println("Start check node exist...");
        if (experimentalNodeDao.getNodeCountAndStatusIsSuccess() != 0) {
            List<ExperimentalNode> experimentalNodeList = experimentalNodeDao.getAllStatusSuccessNode();
            for (ExperimentalNode experimentalNode : experimentalNodeList) {
                System.out.println("Start check ip:" + experimentalNode.getIp());
                try {
                    if (!pingService.ping(experimentalNode.getIp())) {
                        System.out.println("Ip:" + experimentalNode.getIp() + " is failing");
                        experimentalNodeDao.updateStatusByIp(experimentalNode.getIp(), "错误");
                    } else {
                        System.out.println("ip:" + experimentalNode.getIp() + " is running");
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                System.out.println("check ip:" + experimentalNode.getIp() + " end");
            }
        } else {
            System.out.println("No node can be checked");
        }
        System.out.println("Check node exist end");
    }
}

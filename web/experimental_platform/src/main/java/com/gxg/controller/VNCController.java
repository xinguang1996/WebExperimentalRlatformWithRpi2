package com.gxg.controller;

import com.gxg.entities.User;
import com.gxg.services.VNCService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Created by 郭欣光 on 2017/12/28.
 */


@Controller
public class VNCController {

    @Autowired
    private VNCService vncService;

    /**
     * 该方法用于为用户获得一个空闲的vnc节点（如果已经给用户分配节点，则获取已经分配的节点）
     * @param screenSize
     * @param request
     * @return
     */
    @RequestMapping(value = "/get_one_free_vnc")
    @ResponseBody
    public String getOneFreeVNC(@RequestParam("screenSize") String screenSize, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
//            return "没有用户！";
        } else {
//            User user = new User();
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        }
        String result = vncService.getOneFreeExperimentalNode(request, screenSize);
        return result;
//        String result = vncService.startVNC("192.168.1.101", "600x800");
//        return result;
    }

    /*
    @RequestMapping(value = "/stop_vnc")
    @ResponseBody
    public  String stopVNC() {
        String result = vncService.stopVNC("192.168.1.101");
        return result;
    }*/

    /**
     * 该方法用于浏览器告诉服务器用户正在使用vnc。保持vnc的连接
     * @param request
     * @return
     */
    @RequestMapping(value = "/keep_vnc_connection")
    @ResponseBody
    public String keepVNCConnection(HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
//            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        }
        vncService.updateNodeTime(request);
        return "ok";
    }

    @RequestMapping(value = "/select_one_vnc_node")
    @ResponseBody
    public String selectOneVNCNode(@RequestParam("ip") String ip, @RequestParam("screenSize") String screenSize, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if(session.getAttribute("user") == null) {
//            return "没有用户！";
        } else {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
//            String result = vncService.selectVNCNode(ip, screenSize, user.getId());
//            return result;
        }
        String result = vncService.selectVNCNode(ip, screenSize, request);
        return result;
    }

    @RequestMapping(value = "get_all_experimental_node")
    @ResponseBody
    public String getAllExperimentalNode(HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (session.getAttribute("user") != null) {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        }
        return vncService.getAllExperimentalNodeToJsonString();
    }

    @PostMapping(value = "/get_all_available_experimental_node")
    @ResponseBody
    public String getAllAvailableExperimentalNode(HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (session.getAttribute("user") != null) {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
        }
        return vncService.getAllAvailableExperimentalNodeToJsonString(request);
    }

    @PostMapping(value = "/change_node_status")
    @ResponseBody
    public String changeNodeStatus(@RequestParam("ip") String ip, @RequestParam("status") String status, HttpServletRequest request) {
        HttpSession session = request.getSession();
        if (session.getAttribute("user") != null) {
            User user = (User)session.getAttribute("user");
            session.setAttribute("user", user);
            return vncService.changeNodeStatus(ip, status, user);
        } else {
            return "没有用户！";
        }
    }

    @RequestMapping(value = "/get_node_exist")
    @ResponseBody
    public String getNodeExist(HttpServletRequest request) {
        return vncService.getNodeExist(request);
    }
}

//package com.ruoyi.web.controller.system;
//
//import com.alibaba.fastjson2.JSONObject;
//import com.ruoyi.framework.ws.WebSocket;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import javax.annotation.Resource;
//
//@RestController
//@RequestMapping("/system/ws")
//public class SysWs {
//
//    @Resource
//    private WebSocket webSocket;
//
//    @GetMapping("/ws")
//    public void list(String userId)
//    {
//
//        //创建业务消息信息
//        JSONObject obj = new JSONObject();
//        obj.put("cmd", "topic");//业务类型
////        obj.put("msgId", sysAnnouncement.getId());//消息id
////        obj.put("msgTxt", sysAnnouncement.getTitile());//消息内容
//        //全体发送
////        webSocket.sendAllMessage(obj.toJSONString());
//        //单个用户发送 (userId为用户id)
//        webSocket.sendOneMessage(userId, obj.toJSONString());
//        //多个用户发送 (userIds为多个用户id，逗号‘,’分隔)
////        webSocket.sendMoreMessage(userIds, obj.toJSONString());
//    }
//}

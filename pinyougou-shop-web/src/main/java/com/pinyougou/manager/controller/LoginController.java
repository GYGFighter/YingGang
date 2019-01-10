package com.pinyougou.manager.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("/shopLogin")
public class LoginController {

    @RequestMapping("/name")
    public Map name() {
        //获取当前登录的用户名
        String userName = SecurityContextHolder.getContext().getAuthentication().getName();
        Map map = new HashMap();
        //存入map中返回前端
        map.put("loginName", userName);

        return map;
    }
}

package com.pinyougou.service;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.TbSeller;
import com.pinyougou.sellergoods.service.SellerService;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

//认证类，必须实现UserDetailsService接口
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Reference
    private SellerService sellerService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        System.out.println("经过了 UserDetailsServiceImpl");

        List<GrantedAuthority> authorities = new ArrayList<>();

        //添加角色
        authorities.add(new SimpleGrantedAuthority("ROLE_SELLER"));

        //根据名称得到商家对象,通过数据库中的数据来进行验证登录
        TbSeller tbSeller = sellerService.findOne(username);

        if (tbSeller != null) {
            if (tbSeller.getStatus().equals("1")) {
                //参数1；用户名，参数2；密码，参数3；角色
                return new User(username, tbSeller.getPassword(), authorities);

            } else {
                return null;
            }
        } else {
            return null;
        }

    }
}

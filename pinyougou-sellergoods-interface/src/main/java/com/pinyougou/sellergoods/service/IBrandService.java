package com.pinyougou.sellergoods.service;

import com.pinyougou.pojo.PageResult;
import com.pinyougou.pojo.TbBrand;

import java.util.List;
import java.util.Map;

//商品管理DAO接口
public interface IBrandService {
    //查询所有
    public List<TbBrand> findAll();

    //分页查询
    public PageResult findPage(int page, int size);

    //新增方法
    public void add(TbBrand tbBrand);

    //根据id查询
    TbBrand findById(String id);

    //修改方法
    void update(TbBrand tbBrand);

    //删除方法
    void delete(String[] id);

    //条件查询
    public PageResult findPage(TbBrand brand, int page, int size);

    //品牌的下拉数据
    List<Map> selectOptionList();
}

package com.pinyougou.sellergoods.service.impl;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.mapper.TbBrandMapper;
import com.pinyougou.pojo.PageResult;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.pojo.TbBrandExample;
import com.pinyougou.sellergoods.service.IBrandService;
import org.apache.commons.codec.binary.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Map;

//这个是alibaba的包
@Service
@Transactional
public class IBrandServiceImpl implements IBrandService {

    @Autowired
    private TbBrandMapper tbBrandMapper;

    //查询所有
    @Override
    public List<TbBrand> findAll() {
        List<TbBrand> tbBrands = tbBrandMapper.selectByExample(null);
        return tbBrands;
    }

    //分页查询
    @Override
    public PageResult findPage(int page, int size) {
        //PageHelper分页插件
         PageHelper.startPage(page, size);
         Page<TbBrand> pages = (Page<TbBrand>) tbBrandMapper.selectByExample(null);

         return new PageResult(pages.getTotal(),pages.getResult());
    }

    //新增方法
    @Override
    public void add(TbBrand tbBrand) {
        tbBrandMapper.insert(tbBrand);
    }

    //根据id查询
    @Override
    public TbBrand findById(String id) {

        TbBrand tbBrand = tbBrandMapper.selectByPrimaryKey(Long.parseLong(id));
        return tbBrand;
    }

    //修改功能
    @Override
    public void update(TbBrand tbBrand) {
        tbBrandMapper.updateByPrimaryKey(tbBrand);
    }

    //根据删除数据
    @Override
    public void delete(String[] ids) {
        for (String id : ids) {
            tbBrandMapper.deleteByPrimaryKey(Long.parseLong(id));
        }
    }

    //条件查询
    @Override
    public PageResult findPage(TbBrand brand, int page, int size) {
        //PageHelper分页插件
        PageHelper.startPage(page, size);

        TbBrandExample brandExample = new TbBrandExample();
        TbBrandExample.Criteria criteria = brandExample.createCriteria();
        if (brand != null) {
            //模糊查询品牌名称
            if (brand.getName() != null && brand.getName().length() > 0) {
                criteria.andNameLike("%"+brand.getName() + "%");
            }

            //条件查询首字母
            if (brand.getFirstChar() != null && brand.getFirstChar().length() >0) {
                criteria.andFirstCharLike("%" + brand.getFirstChar() + "%");
            }
        }

        Page<TbBrand> pages = (Page<TbBrand>) tbBrandMapper.selectByExample(brandExample);

        return new PageResult(pages.getTotal(),pages.getResult());
    }

    public List<Map> selectOptionList() {
        return tbBrandMapper.selectOptionList();
    }
}

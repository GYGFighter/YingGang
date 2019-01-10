package com.pinyougou.manager.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.PageResult;
import com.pinyougou.pojo.Result;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.sellergoods.service.IBrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/brand")
public class BrandController {

    @Reference //远程注入，就是不在一个工程模块中
    //@Autowired 本地注入
    private IBrandService iBrandService;

    @RequestMapping("/findAll")
//    @ResponseBody
    public List<TbBrand> findAll() {
        List<TbBrand> brandList = iBrandService.findAll();
        return brandList;
    }

    //分页查询
    @RequestMapping(value = "/findPage/{page}/{size}",method = RequestMethod.GET)
    public PageResult findPage(@PathVariable("page") int page,
                               @PathVariable("size") int size) {
        return iBrandService.findPage(page, size);
    }

    //新增方法
    @RequestMapping("/add")
    public Result add(@RequestBody TbBrand tbBrand) {

        try {
            iBrandService.add(tbBrand);
            return new Result(true, "添加成功");
        } catch (Exception e) {
            return new Result(false, "添加失败");
        }

    }

    //根据id查询
    @RequestMapping(value = "/findById/{id}",method = RequestMethod.GET)
    public TbBrand findById(@PathVariable("id") String id) {
        TbBrand tbBrand = iBrandService.findById(id);
        return tbBrand;
    }

    //修改功能
    @RequestMapping("/update")
    public Result update(@RequestBody TbBrand brand) {

        try {
            iBrandService.update(brand);
            return new Result(true, "修改成功");
        } catch (Exception e) {
            return new Result(false, "修该失败");
        }

    }

    //根据id删除数据
    @RequestMapping("/deleteById/{id}")
    public Result deleteById(@PathVariable("id") String[] id) {

        try {
            iBrandService.delete(id);
            return new Result(true, "删除成功");
        } catch (Exception e) {
            return new Result(false, "删除失败");
        }
    }

    //多条件查询
    @RequestMapping(value = "/search/{page}/{size}",method = RequestMethod.POST)
    public PageResult search(@PathVariable("page") int page,
                             @PathVariable("size") int size,
                             @RequestBody TbBrand brand) {
        PageResult pageResult = iBrandService.findPage(brand, page, size);
        return pageResult;
    }

    //品牌的列表查询
    @RequestMapping("/selectOptionList")
    public List<Map> selectOptionList() {
        List<Map> optionList = iBrandService.selectOptionList();
        return optionList;
    }
}

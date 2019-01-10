package com.pinyougou.manager.controller;

import java.util.List;

import com.pinyougou.pojo.PageResult;
import com.pinyougou.pojo.Result;
import com.pinyougou.pojogroup.Goods;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.TbGoods;
import com.pinyougou.sellergoods.service.GoodsService;

/**
 * controller
 *
 * @author Administrator
 */
@RestController
@RequestMapping("/goods")
public class GoodsController {

    @Reference
    private GoodsService goodsService;

    /**
     * 返回全部列表
     *
     * @return
     */
    @RequestMapping("/findAll")
    public List<TbGoods> findAll() {
        return goodsService.findAll();
    }


    /**
     * 返回全部列表
     *
     * @return
     */
    @RequestMapping("/findPage")
    public PageResult findPage(int page, int rows) {
        return goodsService.findPage(page, rows);
    }

    /**
     * 增加
     *
     * @param goods
     * @return
     */
    @RequestMapping("/add")
    public Result add(@RequestBody Goods goods) {
        //获取登录名，就是为了得到商家的ID，因为商家的ID就是登录名称
        String sellerId = SecurityContextHolder.getContext().getAuthentication().getName();
        goods.getGoods().setSellerId(sellerId);

        try {
            goodsService.add(goods);
            return new Result(true, "增加成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "增加失败");
        }
    }

    /**
     * 修改
     *
     * @param goods
     * @return
     */
    @RequestMapping("/update")
    public Result update(@RequestBody Goods goods) {
        //校验是否是当前商家的id在操作数据
        Goods goods1 = goodsService.findOne(goods.getGoods().getId());

        //	获取当前登录的用户名，因为它就是商家 的id
        String sellerId = SecurityContextHolder.getContext().getAuthentication().getName();

        //判断如果传过来的值不是当前的id值，则抛出非法操作异常
        if (!goods1.getGoods().getSellerId().equals(sellerId) || !goods.getGoods().getSellerId().equals(sellerId)) {
            //如果当前商品的商家id 和 登陆的上家id不一致 或者 前台传过来的商家id  和  登陆的商家id不一致 则是非法操作
            return new Result(false, "非法操作");
        }
        //【*******出于安全考虑，在商户后台执行的商品修改，必须要校验提交的商品属于该商户*******】

        try {
            goodsService.update(goods);
            return new Result(true, "修改成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "修改失败");
        }
    }

    /**
     * 批量修改商品状态状态
     */
    @RequestMapping("/updateStatus/{ids}/{status}")
    public Result updateStatus(@PathVariable("ids") Long[] ids,
                               @PathVariable("status") String status) {

        try {
            goodsService.updateStatus(ids, status);
            return new Result(false, "修改审核状态成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "修改审核状态失败");
        }

    }


    /**
     * 获取实体
     *
     * @param id
     * @return
     */
    @RequestMapping("/findOne")
    public Goods findOne(Long id) {
        return goodsService.findOne(id);
    }

    /**
     * 批量删除
     *
     * @param ids
     * @return
     */
    @RequestMapping("/delete")
    public Result delete(Long[] ids) {
        try {
            goodsService.delete(ids);
            return new Result(true, "删除成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "删除失败");
        }
    }

    /**
     * 查询+分页
     *
     * @param page
     * @param rows
     * @return
     */
    @RequestMapping("/search")
    public PageResult search(@RequestBody TbGoods goods, int page, int rows) {

        //获取商家商品列表
        //获取商品ID,用户名就是商家ID
        String sellerId = SecurityContextHolder.getContext().getAuthentication().getName();

        //添加查询条件
        goods.setSellerId(sellerId);

        PageResult result = goodsService.findPage(goods, page, rows);
        return result;
    }


    /**
     * 更改商品上下架的状态
     */
    @RequestMapping("/updateIsMarkeTableStatus")
    public Result updateIsMarkeTableStatus(Long[] ids,String status) {

        try {
            goodsService.updateIsMarkeTableStatus(ids, status);
            return new Result(true, "更改成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "更改失败,您无法操作该商品!");
        }
    }

}

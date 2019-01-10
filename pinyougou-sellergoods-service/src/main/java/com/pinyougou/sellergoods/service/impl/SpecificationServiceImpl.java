package com.pinyougou.sellergoods.service.impl;
import java.util.List;
import java.util.Map;

import com.pinyougou.pojo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.dubbo.config.annotation.Service;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.pinyougou.mapper.TbSpecificationMapper;
import com.pinyougou.mapper.TbSpecificationOptionMapper;
import com.pinyougou.pojo.TbSpecificationExample.Criteria;
import com.pinyougou.pojogroup.Specification;
import com.pinyougou.sellergoods.service.SpecificationService;


/**
 * 服务实现层
 * @author Administrator
 *
 */
@Service
@Transactional
public class SpecificationServiceImpl implements SpecificationService {

	@Autowired
	private TbSpecificationMapper specificationMapper;
	
	@Autowired
	private TbSpecificationOptionMapper specificationOptionMapper;
	
	/**
	 * 查询全部
	 */
	@Override
	public List<TbSpecification> findAll() {
		return specificationMapper.selectByExample(null);
	}

	/**
	 * 按分页查询
	 */
	@Override
	public PageResult findPage(int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);		
		Page<TbSpecification> page=   (Page<TbSpecification>) specificationMapper.selectByExample(null);
		return new PageResult(page.getTotal(), page.getResult());
	}

	/**
	 * 增加
	 */
	@Override
	public void add(TbSpecification specification) {
		specificationMapper.insert(specification);		
	}
	
	/**
	 * 增加-自定义
	 */
	@Override
	public void add(Specification specification) {
		//添加规格
		TbSpecification tbSpecification = specification.getSpecification();
		specificationMapper.insert(tbSpecification);

		//循环插入规格选项
		List<TbSpecificationOption> specificationOptionList = specification.getSpecificationOptionList();
		for (TbSpecificationOption tbSpecificationOption : specificationOptionList) {
			tbSpecificationOption.setSpecId(tbSpecification.getId()); //规格id

			specificationOptionMapper.insert(tbSpecificationOption);//插入规格数据
		}
	}

	
	/**
	 * 修改
	 */
//	@Override
//	public void update(TbSpecification specification){
//		specificationMapper.updateByPrimaryKey(specification);
//	}	
	@Override
	public void update(Specification specification){
		
		//保存修改的规格
		specificationMapper.updateByPrimaryKey(specification.getSpecification());
		
		//删除原有的规格选项
		TbSpecificationOptionExample example = new TbSpecificationOptionExample();
		TbSpecificationOptionExample.Criteria criteria = example.createCriteria();
		criteria.andSpecIdEqualTo(specification.getSpecification().getId());//指定规格ID为条件
		specificationOptionMapper.deleteByExample(example);
		
		List<TbSpecificationOption> specificationOptionList = specification.getSpecificationOptionList();
		//循环插入规格选项
		for(TbSpecificationOption specificationOption : specificationOptionList){
			System.out.println(specificationOption);
			specificationOption.setSpecId(specification.getSpecification().getId());
			specificationOptionMapper.insert(specificationOption);
		}
		
	}	
	
	/**
	 * 根据ID获取实体
	 * @param id
	 * @return
	 */
//	@Override
//	public TbSpecification findOne(Long id){
//		return specificationMapper.selectByPrimaryKey(id);
//	}
	
	@Override
	public Specification findOne(Long id) {
		Specification specification = new Specification();
		//根据id获取规格实体类
		TbSpecification tbSpecification = specificationMapper.selectByPrimaryKey(id);
		specification.setSpecification(tbSpecification);
		
		//获取规格选型列表
		TbSpecificationOptionExample example = new TbSpecificationOptionExample();
		TbSpecificationOptionExample.Criteria criteria = example.createCriteria();
		criteria.andSpecIdEqualTo(id);	//传过来的id等于数据库中的spec_id，这样就查出来了规格名称对应的规格的数据
		List<TbSpecificationOption> specificationOptionList = specificationOptionMapper.selectByExample(example);
		//设置到封装的实体类中
		specification.setSpecificationOptionList(specificationOptionList);
		return specification;
	}
	
	/**
	 * 批量删除
	 */
	@Override
	public void delete(Long[] ids) {
		for(Long id:ids){
			specificationMapper.deleteByPrimaryKey(id);
			//删除原有的规格选项	
			TbSpecificationOptionExample example=new TbSpecificationOptionExample();
			//工具类。是为了拼接条件的
			TbSpecificationOptionExample.Criteria criteria = example.createCriteria();
			//拼接id是传过来的id
			criteria.andSpecIdEqualTo(id);//指定规格ID为条件
			//然后调用删除方法进行删除
			specificationOptionMapper.deleteByExample(example);//删除
		}		
	}
	
	
		@Override
	public PageResult findPage(TbSpecification specification, int pageNum, int pageSize) {
		PageHelper.startPage(pageNum, pageSize);
		
		TbSpecificationExample example=new TbSpecificationExample();
		Criteria criteria = example.createCriteria();
		
		if(specification!=null){			
						if(specification.getSpecName()!=null && specification.getSpecName().length()>0){
				criteria.andSpecNameLike("%"+specification.getSpecName()+"%");
			}
	
		}
		
		Page<TbSpecification> page= (Page<TbSpecification>)specificationMapper.selectByExample(example);		
		return new PageResult(page.getTotal(), page.getResult());
	}


	//规格列表查询
	@Override
	public List<Map> selectOptionList() {
		return specificationMapper.selectOptionList();
	}
	
}

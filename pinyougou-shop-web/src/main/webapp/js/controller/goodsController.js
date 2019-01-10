//控制层 
app.controller('goodsController', function($scope, $location, $controller, goodsService,
		uploadService, itemCatService, typeTemplateService) {

	$controller('baseController', {
		$scope : $scope
	});// 继承

	// 读取列表数据绑定到表单中
	$scope.findAll = function() {
		goodsService.findAll().success(function(response) {
			$scope.list = response;
		});
	}

	// 分页
	$scope.findPage = function(page, rows) {
		goodsService.findPage(page, rows).success(function(response) {
			$scope.list = response.rows;
			$scope.paginationConf.totalItems = response.total;// 更新总记录数
		});
	}

	// 查询实体
	$scope.findOne = function() {
		
		var id=$location.search()['id'];//获取参数值
		var name=$location.search()['name'];//获取参数值
//		alert(id+" "+name);
		//http://localhost:9102/admin/goods_edit.html#?id=149187842867972&name=test
		if(id==null){
			return;
		}
		goodsService.findOne(id).success(function(response) {
			$scope.entity = response;
			
			//向富文本编辑器添加商品介绍
			editor.html($scope.entity.goodsDesc.introduction);
			
			//显示图片列表
			$scope.entity.goodsDesc.itemImages=JSON.parse($scope.entity.goodsDesc.itemImages);
			
			//显示扩展属性
			$scope.entity.goodsDesc.customAttributeItems=  JSON.parse($scope.entity.goodsDesc.customAttributeItems);	
			
			//规格
			$scope.entity.goodsDesc.specificationItems= JSON.parse($scope.entity.goodsDesc.specificationItems);
//			[
//			 {"attributeName":"网络","attributeValue":["移动3G","移动4G","联通3G","联通4G"]},
//			 {"attributeName":"机身内存","attributeValue":["16G","32G"]}
//			]
			//itemList
//			[
//			{"spec":{"网络":"移动3G","机身内存":"16G"},"price":0,"num":99999,"status":"0","isDefault":"0"},
//			{"spec":{"网络":"移动4G","机身内存":"16G"},"price":0,"num":99999,"status":"0","isDefault":"0"}
//			]
			//sku列表规格列转换
			for(var i=0;i<$scope.entity.itemList.length;i++){
				$scope.entity.itemList[i].spec=JSON.parse($scope.entity.itemList[i].spec);
			}
		});
	}
	
	//根据规格名称和选项名称返回是否被勾选
//	[
//	 {"attributeName":"网络","attributeValue":["移动3G","移动4G","联通3G","联通4G"]},
//	 {"attributeName":"机身内存","attributeValue":["16G","32G"]}
//	]
	$scope.checkAttributeValue=function(specName,optionName){
		
		var items = $scope.entity.goodsDesc.specificationItems;
		var object = $scope.searchObjectByKey(items,'attributeName',specName);
		//object代表一个{"attributeName":"机身内存","attributeValue":["16G","32G"]}
		if(object!=null){
			if(object.attributeValue.indexOf(optionName)>=0){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
	
	// 保存
	$scope.save = function() {
		
		$scope.entity.goodsDesc.introduction = editor.html();// 获取服务本编辑器的值给goodsDesc
		
		var serviceObject;// 服务层对象
		if ($scope.entity.goods.id != null) {// 如果有ID
			serviceObject = goodsService.update($scope.entity); // 修改
		} else {
			serviceObject = goodsService.add($scope.entity);// 增加
		}
		serviceObject.success(function(response) {
			if (response.success) {
				// 重新查询
				// $scope.reloadList();//重新加载
				alert("保存成功！");
				$scope.entity = {};
				editor.html("");// 清空富文本编辑器
				location.href="goods.html";
			} else {
				alert(response.message);
			}
		});
	}

	// 增加-没有修改
	$scope.add = function() {
		$scope.entity.goodsDesc.introduction = editor.html();// 获取服务本编辑器的值给goodsDesc
//		alert("add");
		goodsService.add($scope.entity).success(function(response) {
			if (response.success) {
				// 重新查询
				// $scope.reloadList();//重新加载
				alert("增加成功！");
				$scope.entity = {};
				editor.html("");// 清空富文本编辑器
			} else {
				alert(response.message);
			}
		});
	}
	// 批量删除
	$scope.dele = function() {
		// 获取选中的复选框
		goodsService.dele($scope.selectIds).success(function(response) {
			if (response.success) {
				$scope.reloadList();// 刷新列表
				$scope.selectIds = [];
			}
		});
	}
 
	$scope.searchEntity = {};// 定义搜索对象

	// 搜索
	$scope.search = function(page, rows) {
		goodsService.search(page, rows, $scope.searchEntity).success(
				function(response) {
					$scope.list = response.size;
					$scope.paginationConf.totalItems = response.total;// 更新总记录数
				});
	}
	// 上传
	$scope.uploadFile = function() {
//		alert("controller");
		uploadService.uploadFile().success(function(response) {
			if (response.success) {
				$scope.image_entity.url = response.message;// 设置图片的url，回显图片
			} else {
				alert(response.message);
			}
		}).error(function() {
			alert("上传发生错误");
		});
	}
	//定义页面实体结构
	$scope.entity={goods:{},goodsDesc:{itemImages:[],specificationItems:[]}}
	//添加图片列表
	$scope.add_image_entity=function(){
		$scope.entity.goodsDesc.itemImages.push($scope.image_entity);
	}
	//删除图片，不是从数据库删除，从前端模型里删除
	$scope.remove_image_entity=function(index){
		$scope.entity.goodsDesc.itemImages.splice(index,1);
	}
	
	//读取一级分类
	$scope.selectItemCatList=function(){
		itemCatService.findByParentId(0).success(function(response){
			$scope.itemCat1List=response;
		});
	}
	//读取二级分类
	$scope.$watch("entity.goods.category1Id",function(newValue,oldValue){
//		alert(newValue);
		//加上判断--扩展
		if(newValue == oldValue || newValue == null || newValue == "undefined"){
	        //不执行任何操作
	        return;
	    }
		//根据选择的值，查询二级分类
		itemCatService.findByParentId(newValue).success(function(response){
			$scope.itemCat2List=response;
		});
	});
	
	//读取三级分类
	$scope.$watch("entity.goods.category2Id",function(newValue,oldValue){
		if(newValue == oldValue || newValue == null || newValue == "undefined"){
	        //不执行任何操作
	        return;
	    }
		//根据选择的值，查询三级分类
		itemCatService.findByParentId(newValue).success(function(response){
			$scope.itemCat3List=response;
		});
	});
	//显示模版id
	$scope.$watch("entity.goods.category3Id",function(newValue,oldValue){
		if(newValue == oldValue || newValue == null || newValue == "undefined"){
	        //不执行任何操作
	        return;
	    }
		//根据选择的值，查询三级分类
		itemCatService.findOne(newValue).success(function(response){
			$scope.entity.goods.typeTemplateId=response.typeId;
		});
	});
	//监控模版id，显示品牌列表，读取规格列表
	$scope.$watch("entity.goods.typeTemplateId",function(newValue,oldValue){
//		alert(newValue);
//		alert(oldValue);
		if(newValue == oldValue || newValue == null || newValue == "undefined"){
	        //不执行任何操作
	        return;
	    }
		typeTemplateService.findOne(newValue).success(function(response){
			$scope.typeTemplate=response;//获取类型模板 
			$scope.typeTemplate.brandIds= JSON.parse( $scope.typeTemplate.brandIds);//品牌列表
			//如果没有ID，则加载模板中的扩展数据  没有id代表新增
			if($location.search()['id']==null){
				//扩展属性 =两边不一样，为了保存时候构建结构
				$scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.typeTemplate.customAttributeItems);
			}
		});
		//查询规格列表
    	typeTemplateService.findSpecList(newValue).success(
    		function(response){
    			$scope.specList=response;
    			//[
    			// {"id":27,"text":"网络","options":"[{"id":98,"optionName":"移动3G","specId":27,"orders":1},{"id":99,"optionName":"移动4G","specId":27,"orders":2}]"},
    			// {"id":32,"text":"机身内存","options":"[{"id":118,"optionName":"16G","specId":32,"orders":1},{"id":119,"optionName":"32G","specId":32,"orders":2}]"}
    			//]
    		}
    	);    	
	});
	//首先$scope.entity={goods:{},goodsDesc:{itemImages:[],specificationItems:[]}}中加入specificationItems:[]
	//选中复选框调用此方法参数n ame为 规格名称（网络制式，屏幕尺寸），value为规格选型（"移动3G","移动4G","5.5寸","5寸"）
	//[
	//{"attributeName":"网络制式","attributeValue":["移动3G","移动4G"]},
	//{"attributeName":"屏幕尺寸","attributeValue":["5.5寸","5寸"]}
	//]
	$scope.updateSpecAttribute=function($event,name,value){
		var object = $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems,'attributeName',name);
		//object是具体对象{"attributeName":"网络制式","attributeValue":["移动3G","移动4G"]}
		if(object!=null){
			if($event.target.checked){
				object.attributeValue.push(value);
			}else{
				//取消勾选
				object.attributeValue.splice(object.attributeValue.indexOf(value),1);//移除选项
				if(object.attributeValue.length==0){//如果选项都取消了，将此条记录移除
					$scope.entity.goodsDesc.specificationItems.splice(
							$scope.entity.goodsDesc.specificationItems.indexOf(object),1);
				}
			}
		}else{
			$scope.entity.goodsDesc.specificationItems.push({"attributeName":name,"attributeValue":[value]});
		}
	}
	
	//创建SKU列表
	$scope.createItemList=function(){
		$scope.entity.itemList=[{spec:{},price:0,num:99999,status:"0",isDefault:"0"}];//初始化
		var items = $scope.entity.goodsDesc.specificationItems;
//		[
//		{"attributeName":"网络","attributeValue":["移动3G","移动4G"]},
//		{"attributeName":"机身内存","attributeValue":["16G,64G"]}
//		]
		for(var i=0;i<items.length;i++){
			$scope.entity.itemList=addColumn($scope.entity.itemList, items[i].attributeName, items[i].attributeValue);
		}
//		[
//		{"spec":{"网络":"移动3G","机身内存":"16G"},"price":0,"num":99999,"status":"0","isDefault":"0"},
//		{"spec":{"网络":"移动4G","机身内存":"16G"},"price":0,"num":99999,"status":"0","isDefault":"0"}
//		]
	}
	
	//添加列值 参数(list为原来的集合，columnName为新的列名也就是规格名称，columnValues为规格选项数组)
	addColumn=function(list,columnName,columnValues){
		var newList=[];//新的集合
		for(var i=0;i<list.length;i++){
			var oldRow=list[i];
			for(var j=0;j<columnValues.length;j++){
				var newRow = JSON.parse(JSON.stringify(oldRow));
				newRow.spec[columnName]=columnValues[j];
				newList.push(newRow);
			}
		}
		return newList;
	}
	
	//商品列表页面的状态
	$scope.auditStatus=['未审核','已审核','审核未通过','关闭'];//商品状态
	//商品上下架状态
	$scope.isMarkeStatu=['上架','已下架'];//商品状态
	
	$scope.itemCatList=[];//商品分类列表
	//加载商品分类列表
	$scope.findItemCatList=function(){
		itemCatService.findAll().success(
			function(response){  //[{id:1,parent_id:0,name:图书、音像、电子书刊,typeid:35},{}]
				for(var i=0;i<response.length;i++){
					$scope.itemCatList[response[i].id]=response[i].name;
				}
			}
		);
	}
	//更改上下架状态
	$scope.updateIsMarkeTableStatus=function(status){
		goodsService.updateIsMarkeTableStatus($scope.selectIds,status).success(
			function(response){
				if(response.success){//成功
					$scope.reloadList();//刷新列表
					$scope.selectIds=[];//清空ID集合
				}else{
					alert(response.message);
				}
			}
		);		
	}
	
	
});

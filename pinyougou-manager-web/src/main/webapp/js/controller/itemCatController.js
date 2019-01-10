//控制层 
app.controller('itemCatController', function($scope, $controller,
		itemCatService) {

	$controller('baseController', {
		$scope : $scope
	});// 继承

	// 读取列表数据绑定到表单中
	$scope.findAll = function() {
		itemCatService.findAll().success(function(response) {
			$scope.list = response;
		});
	}

	// 分页
	$scope.findPage = function(page, rows) {
		itemCatService.findPage(page, rows).success(function(response) {
			$scope.list = response.rows;
			$scope.paginationConf.totalItems = response.total;// 更新总记录数
		});
	}

	// 查询实体
	$scope.findOne = function(id) {
		itemCatService.findOne(id).success(function(response) {
			$scope.entity = response;
		});
	}

	// 保存
	$scope.save = function() {
		var serviceObject;// 服务层对象
		if ($scope.entity.id != null) {// 如果有ID
			serviceObject = itemCatService.update($scope.entity); // 修改
		} else {
			
			$scope.entity.parentId = $scope.parentId;//赋予上级id值
//			alert(JSON.stringify($scope.entity.typeIdValue));
//			alert(JSON.stringify($scope.entity.typeId));
			
			serviceObject = itemCatService.add($scope.entity);// 增加
		}
		serviceObject.success(function(response) {
			if (response.success) {
				// 重新查询
//				$scope.reloadList();// 重新加载
				window.location.reload();
			} else {
				alert(response.message);
			}
		});
	}
	//$scope.typeTemplateList={data:[{"id":35,"text":"手机"},{"id":37,"text":"电视"}]};
	//模版列表
	$scope.typeTemplateList={data:[]};
	//读取模版列表
	$scope.findTemplateList=function(){
		itemCatService.selectOptionList().success(
			function(response){
				$scope.typeTemplateList={data:response};
			}
		);
	}

	// 批量删除
	$scope.dele = function() {
		alert($scope.selectIds);
		// 获取选中的复选框
		itemCatService.dele($scope.selectIds).success(function(response) {
			if (response.success) {
//				$scope.reloadList();// 刷新列表
//				$scope.selectIds = [];
				window.location.reload();
			}else{
				alert(response.message);
			}
		});
	}

	$scope.searchEntity = {};// 定义搜索对象

	// 搜索
	$scope.search = function(page, rows) {
		itemCatService.search(page, rows, $scope.searchEntity).success(
				function(response) {
					$scope.list = response.rows;
					$scope.paginationConf.totalItems = response.total;// 更新总记录数
				});
	}
	
	$scope.parentId=0;//上级分类id  用于新增时候
	
	//根据上级分类id查询列表
	$scope.findByParentId = function(parentId) {
		itemCatService.findByParentId(parentId).success(function(response) {
			
			$scope.parentId=parentId;
			
			$scope.list=response;
			$scope.selectIds=[];//选中的ID集合
		});
	}
	
	$scope.grade=1//默认为1级别
	//设置当前级别
	$scope.setGrade=function(value){
		$scope.grade=value;
	}

	$scope.selectList=function(p_entity){
		alert($scope.grade);
//		alert(JSON.stringify(p_entity));
		if($scope.grade==1){//如果为1级
			$scope.entity_1 = null;
			$scope.entity_2 = null;
		}
		if($scope.grade==2){//如果为2级
			$scope.entity_1 = p_entity;
			$scope.entity_2 = null;
		}
		if($scope.grade==3){//如果为3级
			$scope.entity_2 = p_entity;
		}
		$scope.findByParentId(p_entity.id);//查询此级下级列表
	}

});

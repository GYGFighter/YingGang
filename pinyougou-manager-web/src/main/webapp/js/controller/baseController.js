app.controller("baseController",function($scope){
	/**
	*分页控件配置
	*/
	$scope.paginationConf = {
		 currentPage: 1,//当前页
		 totalItems: 0,
		 itemsPerPage: 10,//每页记录数
		 perPageOptions: [10, 20, 30, 40, 50],//分页选项
		 onChange: function(){//当页码变更时会调用此方法
        	 $scope.reloadList();//重新加载
		 }
	}; 
	
	//刷新列表
	$scope.reloadList=function(){
		$scope.search($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
	}
	
	$scope.selectIds=[];//选中的ID集合 
	//更新复选
	$scope.updateSelection = function($event, id){
		if($event.target.checked){//为true，则是被选中，放入数组中
			$scope.selectIds.push(id);//push向集合添加元素
		}else{
			var idx = $scope.selectIds.indexOf(id);//获取原始在数组的下标，默认从0开始
			$scope.selectIds.splice(idx,1);//删除
		}
	}
	
	$scope.selectAll = function ($event) {
		$scope.selectIds=[];//清空数组
        var isAllChecked = $event.target.checked;
        if(isAllChecked){
        	for(var i=0;i<$scope.list.length;i++){
        		$scope.selectIds.push($scope.list[i].id);
        	}
        }
    };
	//提取json字符串数据中某个属性，返回拼接字符串 逗号分隔
	$scope.jsonToString=function(jsonString,key){
		var json = JSON.parse(jsonString);//将json字符串转换为json对象
		var value="";
		for(var i=0;i<json.length;i++){
			if(i>0){
				value += ",";
			}
			value += json[i][key];
		}
		return value;
	}
	//从集合中按照key查询对象 参数 list为集合，key为'attributeName'字符串，keyValue为规格名称'网络'或者'机身内存'
//	[
//	 {"attributeName":"网络","attributeValue":["移动3G","移动4G","联通3G","联通4G"]},
//	 {"attributeName":"机身内存","attributeValue":["16G","32G"]}
//	]
	$scope.searchObjectByKey=function(list,key,keyValue){
		if(list!=null){
			for(var i=0;i<list.length;i++){
	//			alert(list[i]['attributeName']);
	//			alert(list[i].attributeName);
				if(list[i][key]==keyValue){
					return list[i];
				}
			}
		}
		return null;
	}
	
});
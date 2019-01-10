app.controller("brandController",function ($scope,$controller,brandService) {

    $controller("baseController",{$scope:$scope});//伪继承

    $scope.findAll = function () {
        //访问的地址
        brandService.findAll().success(
            function (data) {
                $scope.list = data;
            }
        );
    };

    //分页
    $scope.findPage = function (page, size) {
        brandService.findPage(page,size).success(
            function (response) {
                $scope.list = response.size;
                $scope.paginationConf.totalItems = response.total; // 更新总记录数
            }
        );
    };

    //条件查询
    $scope.searchEntity = {}; //定义搜索对象,初始化，因为页面一打开就开始调用，不初始化，就会报错undefined
    $scope.search = function (page,size) {
        brandService.search(page,size,$scope.searchEntity).success(
            function (response) {
                $scope.paginationConf.totalItems = response.total; //总记录数
                $scope.list = response.size; //当前页数,给列表赋值
            }
        )
    };

    //保存或者修改
    $scope.save = function() {
        var object = null;  //不适用对象来判断
        if ($scope.entity.id !=null) { //判断如果id不是null就是更新吧方法名称设置为update
            object = brandService.update($scope.entity);
        }else{
            object = brandService.add($scope.entity);
        }

        object.success(
            function (data) {
                if (data) {
                    //添加成功就重新加载
                    $scope.reloadList();
                    // alert(data.message);
                }else {
                    alert(data.message);
                }
            }
        );
    };

    //根据id查询
    $scope.findById = function (id) {
        brandService.findById(id).success(
            function (data) {
                $scope.entity = data;
            }
        );
    };

    //删除方法
    $scope.delete = function () {
        if (confirm('确定要删除吗？')) {
            brandService.delete($scope.selectIds).success(
                function (data) {
                    if (data) {
                        //删除成功，刷新列表
                        $scope.reloadList();
                    }
                }
            );
        }
    }
});
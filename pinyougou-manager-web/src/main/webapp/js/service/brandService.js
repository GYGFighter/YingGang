app.service("brandService", function ($http) {   //*******品牌服务层*******//
    //读取列表数据绑定到表单中
    this.findAll = function () {
        return $http.get("../brand/findAll.do");
    };

    //
    this.findPage = function (page, size) {
        return $http.get("../brand/findPage/" + page + "/" + size);
    };

    //条件查询
    this.search=function(page, size, searchEntity){
        return $http.post("../brand/search/" + page + "/" + size,searchEntity)
    };

    //添加
    this.add = function (entity) {
        return $http.post("../brand/add", entity)
    };

    //修改
    this.update = function (entity){
        return $http.post("../brand/update",entity)
    };

    //根据id查询
    this.findById=function(id) {
        return $http.get("../brand/findById/" + id)
    };

    //删除
    this.delete = function (selectIds) {
        return $http.get("../brand/deleteById/" + selectIds)
    };


    //下拉列表数据
    this.selectOptionList = function(){
        return $http.get('../brand/selectOptionList.do');
    };


});
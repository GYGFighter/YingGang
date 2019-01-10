app.service("uploadService",function($http){
	//上传文件
	this.uploadFile=function(){
//		alert("uploadService");
		var fromData = new FormData();
		fromData.append("file",file.files[0]);
		return $http({
			method: "POST",
			url: "../upload.do",
			data: fromData,
			headers: {'Content-Type':undefined},//设置Content-Type为multipart/form-data
			transformRequest: angular.identity//将序列化我们的formdata object.
		});
	}
});
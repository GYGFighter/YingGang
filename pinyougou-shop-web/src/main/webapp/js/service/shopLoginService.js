//登陆服务层
app.service("loginService",function($http){
	this.loginName=function(){
		return $http.get("../shopLogin/name.do");
	}
});
app.controller("shopLoginController", function ($scope,$controller,shopLoginService) {
    // alert("222222222");
    //获取当前登录的用户名
    $scope.showLoginName=function () {
        shopLoginService.loginName().success(
            function (response) {
                $scope.loginName = response.loginName;
            }
        )
    }
});
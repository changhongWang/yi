angular.module('yi',['ng','ngRoute','ngAnimate'])
    .controller('startCtrl',function ($timeout,$location,$animate) {
        //首页停留2s后跳转到菜品详情页
        $timeout(function () {
            $location.path('home');
            console.log('跳转到首页')
        },2000);
        $animate()

    })
    .controller('mainCtrl',function ($scope,$http) {
        console.log('执行CTRL')
        $scope.isLoading=true;
        $scope.hasMore = true;
//            console.log('进入Angular');
        $http.get('data/dish_listbypage.php').success(function (data) {
            $scope.pageList=data;
            console.log(data);
            $scope.isLoading=false;
        });
        $scope.refresh=function () {
            //页面刷新的逻辑
            //如果返回[]，则可以

            $scope.isLoading=true;
            $http.get('data/dish_listbypage.php?start='+$scope.pageList.length).success(function (data) {
                if(data.length==0){
                    $scope.hasMore = false;
                }
                $scope.pageList=$scope.pageList.concat(data);
                $scope.isLoading=false;
            });
        };
        $scope.$watch('dish_name_material',function () {
            console.log($scope.dish_name_material);
            if($scope.dish_name_material.length==0){
                $scope.search_res=[];
                return;
            }
            $http.get('data/dish_listbykw.php?kw='+$scope.dish_name_material).success(function (data) {
                $scope.pageList = data;
                if(data.length==0){
                    $scope.search_res=[{name: "抱歉，未搜索到任何结果哦，您可尝试更换关键字"}];
                    $scope.search_res_null=true;
                }
                $scope.hasMore=false;

//
//                    console.log('结果'+$scope.search_res);
            })
        });
    })
    .controller('detailCtrl',function ($scope,$http,$routeParams) {
        console.log($routeParams.dish_detail);
        $http.get('data/dish_listbydid.php?did='+$routeParams.dish_detail).success(function (data) {
            $scope.details=data;
        })
    })
    .controller('orderCtrl',function ($scope,$http,$routeParams,$location) {
        $scope.order={};
        $scope.confirm_ordering = function () {
            if($scope.user_name.length==0||$scope.sex.length==0||$scope.phone.length==0||$scope.addr.length==0){
                alert('表单未填写完整，请重新填写');
            }else{
                $scope.order.user_name=$scope.user_name;
                $scope.order.sex = $scope.sex;
                $scope.order.phone = $scope.phone;
                $scope.order.addr = $scope.addr;
                $scope.order.did = $routeParams.did;
                console.log($scope.order);

                $http.post('data/order_add.php',$.param($scope.order)).success(function (data) {
                    console.log(data);
                    $location.path('order_success/'+data.oid);

                })
            }
        };

    })
    .controller('orderSuccessCtrl',function ($scope,$routeParams) {
        $scope.order_num = $routeParams.oid;

    })
    .controller('myOrderCtrl',function ($scope,$http) {
        $http.get('data/dish_listbyphone.php?phone='+'18829290174').success(function (data) {
            $scope.orderList = data;
        })
    })
    .controller('homeCtrl',function ($scope,$http) {
        $http.get('data/dish_listbypage_menu.php').success(function (data) {
            $scope.pageList=data;
            console.log($scope.pageList)
//                    $scope.isLoading=false;
        });
        $scope.$watch('dish_name_material',function () {
            console.log($scope.dish_name_material);
            if($scope.dish_name_material.length==0){
                $scope.search_res=[];
                return;
            }
            $http.get('data/dish_listbykw.php?kw='+$scope.dish_name_material).success(function (data) {
                $scope.pageList = data;
                if(data.length==0){
                    $scope.search_res=[{name: "抱歉，未搜索到任何结果哦，您可尝试更换关键字"}];
                    $scope.search_res_null=true;
                }
                $scope.hasMore=false;

//
//                    console.log('结果'+$scope.search_res);
            })
        });
    })
    .controller('userCenterCtrl',function ($scope,$http,$rootScope) {
        if($rootScope.user_name !== undefined){
            $scope.user_name = $rootScope.user_name;
            $rootScope.ifLogedin=false;
        }else{
            $rootScope.ifLogedin=true;
        }
        console.log($rootScope.ifLogedin);
    })
    .controller('userRegisterCtrl',function ($scope, $http,$location,$rootScope) {
        //用户输入用户名后异步检测用户名可用性
        //ifRegistedUserName
        $scope.confirmUserName = function () {

            $http.get('data/user_login.php?user_name='+$scope.user_name).success(function (data) {
                if(data.length==0){
                    $scope.ifRegistedUserName = false;
                }else if(data[0].user_name){
                    $scope.ifRegistedUserName = true;
                }
            })
        }
        //处理用户注册
        $scope.user_register=function () {
            $scope.user = {};
            $scope.user.user_name = $scope.user_name;
            $scope.user.pwd = $scope.user_password;
            $scope.user.email = $scope.email;
            console.log($.param($scope.user));

            if($scope.user_name===undefined || $scope.user_password === undefined || $scope.email === undefined){
                alert('用户注册信息不完整，请查证后再重新注册');
            }else if($scope.user_name=='' ||$scope.password=='' ||$scope.email==''){
                alert('用户注册信息不完整，请查证后再重新注册');
            }else if($scope.user_name!==undefined && $scope.user_password !== undefined && $scope.email !== undefined){
                $http.post('data/user_register.php',$.param($scope.user)).success(function (data) {
                    console.log('数据为：'+data);
                    alert('注册成功');
                    //跳转到注册成功页面（此时已经登录成功）
                    $rootScope.user_name = $scope.user_name;
                    $rootScope.ifLogedin = true;
                    $location.path('user_center');
                })
            }

        };

        //验证 用户密码验证
        $scope.ifConfirmPwd = false;
        $scope.confirm_pwd = function () {
            if($scope.user_password!=0&&$scope.confirm_password!=0&&($scope.user_password != $scope.confirm_password)){
                $scope.ifConfirmPwd = true;
            }else{
                $scope.ifConfirmPwd = false;
            }
        }

    })
    .controller('userLoginCtrl',function ($scope,$http,$location,$rootScope) {

        $scope.userLogin = function () {
            $scope.user = {};
            $scope.user.user_name = $scope.user_name;
            $scope.user.pwd = $scope.user_password;
            $http.post('data/user_login.php',$.param($scope.user)).success(function (data) {
                console.log(data);
                if(data.length>0&&data[0].user_password==$scope.user_password){
                    console.log('您好，尊敬的客户'+$scope.user_name);
                    $rootScope.user_name = $scope.user_name;
                    $rootScope.ifLogedin = true;
                    $scope.ifPasswordNotRight=false;
                    $location.path('user_center')
                }else{
                    $scope.ifPasswordNotRight=true;
                    $rootScope.ifLogedin = false;
                }

            })
        }
    })
    .config(function ($routeProvider) {
        $routeProvider
            .when('/start',{
                templateUrl:'tpl/start.html'
//                    controller:'startCtrl'
            })
            .when('/main',{
                templateUrl:'tpl/main.html'
            })
            .when('/detail/:dish_detail',{
                templateUrl:'tpl/detail.html'
//                    controller:'detail1Ctrl'
            })
            .when('/order/:did',{
                templateUrl:'tpl/order.html'
//                    controller:'orderCtrl'
            })
            .when('/order_success/:oid',{
                templateUrl:'tpl/order_success.html'
            })
            .when('/myOrder',{
                templateUrl:'tpl/myOrder.html'
//                    controller:'myOrderCtrl'
            })
            .when('/home',{
                templateUrl:'tpl/home.html'
            })
            .when('/user_center',{
                templateUrl:'tpl/user_center.html'
            })
            .when('/user_login',{
                templateUrl:'tpl/user_login.html'
            })
            .when('/user_register',{
                templateUrl:'tpl/user_register.html'
            })
            .otherwise('start')
    })
    .run(function ($http) {
        //配置POST请求的默认头部
        $http.defaults.headers.post = {'Content-Type':'application/x-www-form-urlencoded'}
    })
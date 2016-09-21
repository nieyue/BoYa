angular.module('starter.controllers', [])
.controller('tabCtrl',function($rootScope){
  console.log("tab")
  //检查网络
    $rootScope.checkNetWork=function(){   
      document.addEventListener("deviceready", checkConnection, false);  
     function checkConnection() {  
         var networkState = navigator.connection.type;  
  
         var states = {};  
         //网络状态  
         states[Connection.UNKNOWN]  = 'Unknown connection';  
         states[Connection.ETHERNET] = 'Ethernet connection';  
         states[Connection.WIFI]     = 'WiFi connection';  
         states[Connection.CELL_2G]  = 'Cell 2G connection';  
         states[Connection.CELL_3G]  = 'Cell 3G connection';  
         states[Connection.CELL_4G]  = 'Cell 4G connection';  
         states[Connection.CELL]     = 'Cell generic connection';  
         states[Connection.NONE]     = '网络异常，重新连接？';  
         if(states[networkState] == "网络异常，重新连接？"){  
            $("ion-content").each(function(){
             var Tthis= $(this);
                Tthis.hide();
                if(!Tthis.next(".checkNetWork")[0] || Tthis.next(".checkNetWork")[0]==''){
                Tthis.parent("ion-view").append("<ion-content class='checkNetWork'></ion-content>");
                }
                Tthis.next(".checkNetWork").load("templates/no-network.html");
        });    
         }else { 
               $("ion-content").each(function(){
                var Tthis= $(this);
                  Tthis.show();
                   Tthis.next(".checkNetWork").remove();
              });
         }  
     }
};
})

.controller('shoppingCtrl', function($rootScope,$scope,$interval,$timeout,$ionicModal,$ionicPopup) {
//检查网络
// 加载Cordova 添加判断网络插件 
$rootScope.checkNetWork();
//模型
  function showModal(urli){
    $ionicModal.fromTemplateUrl(urli, {
        scope: $scope,
        animation: 'silde-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
  });
  }
$rootScope.weatherInfo=$rootScope.getTownship="加载...";

//获取地理位置
function getLocation(){
if (navigator.geolocation) {  
    navigator.geolocation.getCurrentPosition(function(pos) {      
  var url=" http://restapi.amap.com/v3/geocode/regeo?output=json&location="+(pos.coords.longitude).toFixed(6)+','+(pos.coords.latitude).toFixed(6)+"&key=9ea7577b3d7eaf16d3c98068c48c4071&radius=1000&extensions=all"; 
//获取天气
function getWeatherInfo(data){
 $scope.getLocationDetails=function(){
      $.get("http://restapi.amap.com/v3/weather/weatherInfo?city="+data.regeocode.addressComponent.city+"&key=9ea7577b3d7eaf16d3c98068c48c4071",function(data){
  $rootScope.weatherInfo=data.lives[0].weather+","+data.lives[0].winddirection+"风,"+data.lives[0].windpower+"级,空气湿度："+data.lives[0].humidity+" 气温"+data.lives[0].temperature+"℃ "+"";
    if($scope.modal!=null||$scope.modal!=undefined){
    $scope.modal.remove();
  }
  showModal("locationDetails.html");
$rootScope.$apply();
});
    }
} 
//获取城市
  if(!localStorage.getItem("userAddress")){
$.get(url,function(data){
  $rootScope.getLocation=data.regeocode.formatted_address;
  $rootScope.getTownship=data.regeocode.addressComponent.province+data.regeocode.addressComponent.city
  +data.regeocode.addressComponent.district+data.regeocode.addressComponent.township;
  localStorage.setItem("userAddress",JSON.stringify(data));
    getWeatherInfo(data);
});
}else{
  data=JSON.parse(localStorage.getItem("userAddress"));
  $rootScope.getLocation=data.regeocode.formatted_address;
   $rootScope.getTownship=data.regeocode.addressComponent.province+data.regeocode.addressComponent.city
  +data.regeocode.addressComponent.district+data.regeocode.addressComponent.township;
    getWeatherInfo(data);
}
    }, function(err) { 
       //  confirm 对话框
              $ionicPopup.confirm({
               title: '定位错误',
               template: '重新定位?',
               cancelText: '取消',
               okText: '确认',
               okType: 'button-positive'
             }).then(function(res) {
               if(res) {
                 getLocation();
               } else {
                 
               }
             });
          
    }, {  
        enableHighAccuracy: true, // 是否获取高精度结果  
        timeout: 5000, //超时,毫秒  
        maximumAge: 0 //可以接受多少毫秒的缓存位置  
        // 详细说明 https://developer.mozilla.org/cn/docs/Web/API/PositionOptions  
    });  
  } else {  
  myUtils.myLoadingToast('抱歉！无法使用地位功能',null);
  }
}
getLocation();
//离开
$scope.liveWeather=function(){
  if($scope.modal!=null||$scope.modal!=undefined){
    $scope.modal.remove();
  }
};
//重新定位
$scope.getRelLocation=function(){
  //判断每日次数
  if(!localStorage.getItem("location")||!localStorage.getItem("locationDate")||
    (localStorage.getItem("location")&&localStorage.getItem("location")>3
        &&(new Date().getMonth()>localStorage.getItem("locationDate").getMonth()
        ||(new Date().getMonth()==localStorage.getItem("locationDate").getMonth()
          &&new Date().getDate()>localStorage.getItem("locationDate").getDate())))){
                  localStorage.setItem("location",1);
                  localStorage.setItem("locationDate",new Date());
   }else if(localStorage.getItem("location")&&localStorage.getItem("location")<3){
            localStorage.setItem("location",parseInt(localStorage.getItem("location"))+1);
      }else{
        return myUtils.myLoadingToast("定位次数上限",null);
        }

   $ionicPopup.confirm({
               title: '重新定位',
               template: '每天三次刷新定位,剩余'+(4-parseInt(localStorage.getItem("location")))+'次',
               cancelText: '取消',
               okText: '确认',
               okType: 'button-positive'
             }).then(function(res) {
              console.log(res)
               if(res) {
                localStorage.removeItem("userAddress");
                 $rootScope.getTownship="加载...";
                 getLocation();
               } else {
                 localStorage.setItem("location",parseInt(localStorage.getItem("location"))-1);
               }
             });
}
   
    $scope.myActiveSlide = 0;
    $scope.downRefresh=false;
    $scope.items=[{title:'sdfs',description:'sdfffffff',img:''}];
    $.get("http://www.fuwu88.cn/news/list?pageNum=1&pageSize=10&type=%E9%A6%96%E9%A1%B5&orderName=time&orderWay=desc",function(data){
    for (var i = 0; i < data.length; i++) {
      console.log(data)
      var item={};
      item.title=data[i].title;
      item.description=data[i].time+data[i].type;
      item.img=data[i].img_address;
      $scope.items.push(item);
    };
  });

    $scope.newList=[
    {title:'乡镇要闻',active:'active'},
    {title:'工作动态'},
    {title:'通知公告'},
    {title:'政务公开'},
    {title:'乡镇风采'}
    ];

 $scope.activeNew=function(newItem){
console.log( $scope.newList[0])
   $scope.newList[0].active='';
    $scope.active = newItem;
  };
   $scope.focusNews=function(title){
    console.log($(this));
    $(this).addClass("active");
   };
  $scope.list=[{id:100,age:30,name:"张三"},{},{}];
    $scope.downRefresh=true;
    var setInter=$interval(function(){
      if($scope.list.length<8){  
            var obj=[{id:101,age:30,name:"李四"},{},{},{}];
            console.log(obj);
          $scope.list.push(obj);
      }else{
            $scope.downRefresh=false;
            console.log("没有更多了");
            //clearInterval(setInter);
            $interval.cancel(setInter);
          }
           //$scope.downRefresh=false;
    },2000);
  
})

.controller('classificationCtrl', function($rootScope,$scope,$ionicModal) {
  $rootScope.checkNetWork();
  //模型
  function showModal(urli){
    $ionicModal.fromTemplateUrl(urli, {
        scope: $scope,
        animation: 'silde-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
  });
  }
    //选择商品
    $scope.showBlackTea = function() {
      if($scope.modal!=null||$scope.modal!=undefined){
        console.log($scope.modal);
        $scope.modal.remove();
        
      }
      showModal("tab-classification-right.html");
     };
})

.controller('ChatDetailCtrl', function($rootScope,$scope, $stateParams, Chats) {
$rootScope.checkNetWork();
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('shoppingCircleCtrl', function($rootScope,$scope) {
 $rootScope.checkNetWork();
  $scope.settings = {
    enableFriends: true
  };
})
.controller('CatCtrl', function($rootScope,$scope) {
 $rootScope.checkNetWork();
  $scope.aaa="sdaf";

})
.controller('PersonCtrl', function($rootScope,$scope,$ionicModal,$timeout) {
  $rootScope.checkNetWork();
  //初始化
  $scope.haveImg=false;
  $scope.user={};
   $scope.user.userimg='http://www.runoob.com/try/demo_source/venkman.jpg';
   $scope.user.username='278076304@qq.com';
   $scope.user.usersignature='快乐知足常乐！';
   $scope.user.usernicename='聂跃';
   $scope.user.setusernicename=$scope.user.usernicename;
   $scope.user.setusersignature=$scope.user.usersignature;
   
   
  console.log($scope.user.userimg);
  //模型
  function showModal(urli){
    $ionicModal.fromTemplateUrl(urli, {
        scope: $scope,
        animation: 'silde-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
  });
  }
  //登录转注册
 $scope.LoginToRegister = function() {
    console.log("tab-register.html"); 
    $scope.modal.remove();
    showModal("tab-register.html");
  };
  //登录
  $scope.openLogin = function() {
    if($scope.modal!=null||$scope.modal!=undefined){
      console.log($scope.modal);
      $scope.modal.remove();
      
    }
    showModal("tab-login.html");
   };
   //打开用户信息
   $scope.openUserInfo=function() {
     if($scope.modal!=null||$scope.modal!=undefined){
        console.log($scope.modal);
        $scope.modal.remove();
        
      }
     showModal("tab-userinfo.html");
   };
   //设置昵称页面
   $scope.UserInfoToUserNiceName=function() {
     $scope.modal.remove();
     showModal("tab-usernicename.html");
   };
   //设置个性签名页面
   $scope.UserInfoToUserSignature=function() {
        $scope.modal.remove();
     showModal("tab-usersignature.html");
   };
   //设置收货地址管理
   $scope.UserInfoToShippingAddress=function() {
     $scope.modal.remove();
     showModal("tab-shippingaddress.html");
   };
  $scope.closeModal = function() {
     $scope.modal.hide();
   };

   //当我们用完模型时，清除它！
   $scope.$on('$destroy', function() {
     $scope.modal.remove();
   });
   // 当隐藏模型时执行动作
   $scope.$on('modal.hide', function() {
     // 执行动作
     //$scope.openModal();
     alert('dsf')
   });
   // 当移动模型时执行动作
   $scope.$on('modal.removed', function() {
     // 执行动作
     //alert('removed')
   });
   
   $scope.doRefresh = function() {  
     $scope.items = ['Item 1', 'Item 2', 'Item 3']; 
      console.log('Refreshing!');  
      $timeout( function() {  
        //simulate async response  
        $scope.items.push('New Item ' + Math.floor(Math.random() * 1000) + 4);  
        console.log($scope.items);
        //Stop the ion-refresher from spinning  
        $scope.$broadcast('scroll.refreshComplete');  
        
      }, 1000);  
          
    }; 
    //控制字符数
    $scope.usernicenamecheck=function(num){
      $scope.usernicenameerror=mycheckTextService($scope.user.setusernicename,num);
    } 
    $scope.usersignaturecheck=function(num){
      $scope.usersignatureerror=mycheckTextService($scope.user.setusersignature,num);
    } 
   //设置昵称更新同步base
    /*function myuserUpdateInfo(num,name,setname,usererror){
      if (setname.length<=num) {
        name=setname;
        $scope.openUserInfo();
      }else{
        setname=name;
      usererror='';
      }
    };*/
    /* $scope.saveusernicename=function(num){
        myuserUpdateInfo(num,$scope.user.usernicename,$scope.user.setusernicename,$scope.usernicenameerror);
      };*/
    
   $scope.saveusernicename=function(num){
    if ($scope.user.setusernicename.length<=num) {
   $scope.user.usernicename=$scope.user.setusernicename;
   $scope.openUserInfo();
    }else{
      $scope.user.setusernicename=$scope.user.usernicename;
      $scope.usernicenameerror='';
    }
      };
      $scope.saveusersignature=function(num){
        if ($scope.user.setusersignature.length<=num) {
          $scope.user.usersignature=$scope.user.setusersignature;
          $scope.openUserInfo();
        }else{
          $scope.user.setusersignature=$scope.user.usersignature;
          $scope.usersignatureerror='';
        }
      };
  
      
      
      
      //头像图片上传
    userimgupload=function(file){
      photoExt=file.value.substr(file.value.lastIndexOf(".")).toLowerCase();//获得文件后缀名
    //判断照片格式
      if(photoExt!='.jpg'&&photoExt!='.png'){
         alert("请上传后缀名为jpg/png的照片!");
          return false;
      }
      var fileSize = 0;
      var isIE = /msie/i.test(navigator.userAgent) && !window.opera;            
      if (isIE && !file.files) {          
           var filePath = file.value;            
           var fileSystem = new ActiveXObject("Scripting.FileSystemObject");   
           var file = fileSystem.GetFile (filePath);               
           fileSize = file.Size;         
      }else {  
           fileSize = file.files[0].size;     
      } 
      fileSize=Math.round(fileSize/1024*100/1024)/100; //单位为MB
      if(fileSize>=2){
          alert("图片大小为"+fileSize+"MB，超过最大尺寸为2MB，请重新上传!");
          return false;
      }     
      //console.log(file);
        if (file.files && file.files[0])  
         {
           var reader = new FileReader(); 
          reader.onload = function(e){
            console.log(e.target.result);
            $scope.user.userimg=e.target.result;
            $scope.$apply();
        }
          reader.readAsDataURL(file.files[0]);
          $scope.haveImg=true;
        }else{
          $scope.user.userimg=file.value;
            $scope.$apply();
          //console.log(file.value);
          //prevDiv.innerHTML = '<div class="img" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + file.value + '\'"></div>'; 
        }
      };
});
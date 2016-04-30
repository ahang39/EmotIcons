function setUsername(username){
	//网络同步操作省略
	plus.storage.setItem("username",username);
}
mui.plusReady(function(){
	mui("#exit_panel").on('tap','#exit_btn',function(){
		plus.ui.confirm("确定退出登录吗?", function(i) {
			if(i == 0) {
			}
		}, "警告", ["是", "否"]);
	});
	mui("#profile_panel").on('tap',"#profile_setting",function(){
		mui.openWindow({
			url:"module/personalCenter/profile.html",
			id:"profile.html"
		});
	});
	mui("#setting_panel").on('tap',"#notification_setting",function(){
		mui.openWindow({
			url:"module/personalCenter/notification_setting.html",
			id:"notification_setting.html"
		});
	});
	mui("#setting_panel").on('tap',"#privacy_setting",function(){
		mui.openWindow({
			url:"module/personalCenter/privacy_setting.html",
			id:"privacy_setting.html"
		});
	});
	mui("#setting_panel").on('tap',"#common_setting",function(){
		mui.openWindow({
			url:"module/personalCenter/common_setting.html",
			id:"common_setting.html"
		});
	});
	mui("#about_panel").on('tap',"#about",function(){
		mui.openWindow({
			url:"module/personalCenter/about.html",
			id:"about.html"
		});
	});
	mui("#set_profile_panel").on('tap',"#set_profile_username",function(){
		var bts=["确认","取消"];
		plus.nativeUI.prompt("请输入你的用户名",function(e){
			var i=e.index;
			if(e.index==0){
				setUsername(e.value);
			}
		},"","姓名",bts);
	});
	mui('.mui-popover').popover('toggle',document.getElementById("openPopover"));
	
});
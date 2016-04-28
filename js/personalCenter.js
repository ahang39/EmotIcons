mui.plusReady(function(){
	mui("#exit_panel").on('tap','#exit_btn',function(){
		plus.ui.confirm("确定退出登录吗?", function(i) {
			if(i == 0) {
			}
		}, "警告", ["是", "否"]);
	});
	mui(".mheader").on('tap','.nvbt',function(){
		var ws=plus.webview.currentWebview();
		ws.close('auto');
	});
});



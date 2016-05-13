mui.init({
	statusBarBackground: '#f8be06'
});
mui.plusReady(function() {
	plus.nativeUI.toast("加载中");
	var wrapper = document.getElementById("wrapper");
	wrapper.style.height = plus.display.resolutionHeight+"px";
	wrapper.style.width = plus.display.resolutionWidth+"px";
		var square = mui.preload({
			url: 'module/mainView/square.html',
			id: 'square',
			styles: {}, //窗口参数
			extras: {} //自定义扩展参数
		});
		var maker = mui.preload({
			url: 'module/maker/maker.html',
			id: 'maker',
			styles: {}, //窗口参数
			extras: {} //自定义扩展参数
		});
		var image = mui.preload({
			url: 'module/showImage/image.html',
			id: 'image',
			styles: {}, //窗口参数
			extras: {} //自定义扩展参数
		});
		var personalCenter = mui.preload({
			url: 'personalCenter.html',
			id: 'personalCenter',
			styles: {}, //窗口参数
			extras: {} //自定义扩展参数
		});
		var storage = mui.preload({
			url: 'module/mainView/storage.html',
			id: 'storage',
			styles: {}, //窗口参数
			extras: {} //自定义扩展参数
		});
		setTimeout(function() {
			plus.webview.show('square');
		}, 5000);
});
mui.init({
	statusBarBackground: '#f89406'
});
mui.plusReady(function() {
	var usedTime = plus.storage.getItem("usedTime");
	if (usedTime != null) {
		plus.storage.setItem("usedTime", usedTime + 1);
	} else {
		plus.storage.setItem("usedTime", 1);
		var image = mui.preload({
			url: 'module/firstTime.html',
			id: 'firstTime',
			styles: {}, //窗口参数
			extras: {} //自定义扩展参数
		});
	}
	var wrapper = document.getElementById("wrapper");
	wrapper.style.height = plus.display.resolutionHeight + "px";
	wrapper.style.width = plus.display.resolutionWidth + "px";
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
		if(usedTime>1)
			plus.webview.show('square');
		else
			plus.webview.show('firstTime');
	}, 2000);
});
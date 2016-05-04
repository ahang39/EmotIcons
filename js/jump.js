function dispatcher (page) { //list点击item后的事件
	mui.ready(function(){
		switch(page){
			case "personalCenter":
				personalCenter = plus.webview.create("personalCenter.html");
				personalCenter.show("pop-in",150);
			break;
		}
	});

}
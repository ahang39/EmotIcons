var personalCenter;
if(window.plus){
	plusReady();
}else{
	document.addEventListener('plusready',plusReady,false);
}
function plusReady(){ //扩展的js对象在plusready后方可使用
    personalCenter = plus.webview.create("personalCenter.html");
}
function dispatcher (page) { //list点击item后的事件
	switch(page){
		case "personalCenter":
		personalCenter.show("pop-in",150);
		break;
	}
}
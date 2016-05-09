function getDefaultStyle(obj, attribute) {
	return obj.currentStyle ? obj.currentStyle[attribute] : document.defaultView.getComputedStyle(obj, false)[attribute];
}

function toggleSearch() {
	var subView = plus.webview.getWebviewById("_square");
	var search = document.getElementById("search");
	var visibility = getDefaultStyle(search, "visibility")
	if (visibility == "visible") {
		search.style.visibility = "hidden";
		subView.show();
	} else if (visibility == "hidden") {
		search.style.visibility = "visible";
		var input = document.getElementById("searchInput");
		input.focus();
		subView.hide();
	}
}

function showImage() {
	plus.webview.show('image');
}

function goMaker() {
	mui.openWindow({
		url: "module/maker/maker.html",
		id: "maker",
		styles: {
			top: 0, //新页面顶部位置
			bottom: 0 //新页面底部位置
		},
		show: {
			aniShow: "zoom-fade-out"
		}
	});
}

function addEvent() {
	mui(".picShow").on("tap", ".emotIcon", function() {
		var detail = document.getElementById("detail");
		detail.style.visibility = "visible";
	});
	mui(".picShow").on("tap", "#detail", function() {
		var detail = document.getElementById("detail");
		detail.style.visibility = "hidden";
	});
}

function squareInsert() {
	var picShow = document.createElement("div");
	var leftCol = document.getElementById("leftCol").offsetHeight;
	var rightCol = document.getElementById("rightCol").offsetHeight;
	var col = (leftCol <= rightCol) ? 'leftCol' : 'rightCol';
	picShow.className = "picShow";
	picShow.innerHTML = "<div id='detail'><p>作者:碉堡啦</p><p>表情数量: 201</p><p>上传日期: 2006-12-14</p></div><div id='front'><img class='emotIcon' src='../../img/faces/face(1).jpg' alt='' /><p class='name'><span>军火商: </span><span id='author'>叼爆炸</span> </p><div class='container'><ul class='mui-table-view mui-grid-view'><li onclick=\"plus.webview.show('image');\" id='detailBtn' class='mui-table-view-cell mui-col-xs-3 picIcon'><i class='mui-icon iconfont icon-menu'></i></li><li class='mui-table-view-cell mui-col-xs-4 picIcon'><i class='mui-icon iconfont icon-like'></i><span>收藏</span></li><li class='mui-table-view-cell mui-col-xs-5 picIcon'><i class='mui-icon iconfont icon-thumb'></i><span>赞</span></li></ul></div></div>";
	document.getElementById(col).appendChild(picShow);
	addEvent();
}

function pullDownSquare() {
	location.reload();
	mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
	addEvent();
}

function pullUpSquare() {
	setTimeout(function() {
		for (var i = 0; i < 10; i++) {
			squareInsert();
		}
		mui('#refreshContainer').pullRefresh().endPullupToRefresh(false); //参数为true代表没有更多数据了。
	}, 1000);
	addEvent();
}

function storageInsert() {
	var picShow = document.createElement("div");
	picShow.className = "picShow";
	picShow.innerHTML = "<img class='emotIcon' src='../../img/faces/face(2).jpg' /><p class='name'><span>军火商: </span><span id='author'>叼爆炸</span> </p><div class='container'><ul class='mui-table-view mui-grid-view'><li class='mui-table-view-cell mui-col-xs-4 picIcon'><i class='mui-icon iconfont icon-menu'></i></li><li class='mui-table-view-cell mui-col-xs-4 picIcon'><i class='mui-icon iconfont icon-like'></i><span>20</span></li><li class='mui-table-view-cell mui-col-xs-4 picIcon'><i class='mui-icon iconfont icon-thumb'></i><span>35</span></li></ul></div>";
	document.getElementById("storageContainer").appendChild(picShow);
}

function pullDownStorage() {
	location.reload();
	mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
}

function pullUpStorage() {
	setTimeout(function() {
		for (var i = 0; i < 10; i++) {
			storageInsert();
		}
		mui('#refreshContainer').pullRefresh().endPullupToRefresh(false); //参数为true代表没有更多数据了。
	}, 1000);
}
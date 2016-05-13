var pageNum = 1; //初始化页数为1
var noMore = false;

function getDefaultStyle(obj, attribute) {
	return obj.currentStyle ? obj.currentStyle[attribute] : document.defaultView.getComputedStyle(obj, false)[attribute];
}

function toggleSearch() {
	var subView = plus.webview.getWebviewById("_square");
	var search = document.getElementById("search");
	var visibility = getDefaultStyle(search, "visibility")
	if (visibility == "visible") {
		search.style.visibility = "hidden";
		var input = document.getElementById("searchInput");
		input.blur();
		subView.show();
	} else if (visibility == "hidden") {
		search.style.visibility = "visible";
		var input = document.getElementById("searchInput");
		input.focus();
		plus.webview.hide(subView);
	}
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

function getImages(pageNum) {
	mui.ajax("http://tu.myway5.com/php/index.php", {
		data: {
			action: 'datasync_action',
			sub_action: 'getImages',
			page: pageNum
		},
		dataType: 'json',
		type: 'POST',
		timeout: 10000,
		success: function(respon, status, xhr) {
			if (respon.hasNext == "false")
				noMore = true;
			for (i = 0; i < respon.images.length; i++)
				squareInsert(respon.images[i]);
		}
	});
}

function squareInsert(image) {
	var picShow = document.createElement("div");
	var leftCol = document.getElementById("leftCol").offsetHeight;
	var rightCol = document.getElementById("rightCol").offsetHeight;
	var col = (leftCol <= rightCol) ? 'leftCol' : 'rightCol';
	/*console.log(leftCol);
	console.log(rightCol);
	console.log(col);*/
	picShow.className = "picShow";
	/*	picShow.innerHTML = "<div id='detail" + image.id + "' class='detail'><p>作者:" + image.username + "</p><p>表情数量: 1</p><p>上传日期: " + image.time + "</p></div><div id='front"+image.id+"'><img id='emotIcon" + image.id + "' class='emotIcon' src='http://tu.myway5.com/" + image.image + "' /><p class='name'><span>军火商: </span><span id='author"+image.id+"'>" + image.username + "</span> </p><div class='container'><ul class='mui-table-view mui-grid-view'><li  id='detailBtn"+image.id+"' class='mui-table-view-cell mui-col-xs-3 picIcon'><i class='mui-icon iconfont icon-menu'></i></li><li class='mui-table-view-cell mui-col-xs-4 picIcon'><i class='mui-icon iconfont icon-like'></i><span>收藏</span></li><li class='mui-table-view-cell mui-col-xs-5 picIcon'><i class='mui-icon iconfont icon-thumb'></i><span>赞" + image.zan + "</span></li></ul></div></div>";*/
	picShow.innerHTML = "<ul id='detail" + image.id + "' class='detail'><li id='author" + image.id + "' class='detailItem' style='background-color:rgba(23,23,23,0.6);white-space: nowrap; '><span>作者:" + image.username + "</span></li><li id='works" + image.id + "' class='detailItem' style='background-color:rgba(23,23,23,0.6);white-space: nowrap; '>作品数:</li><li id='uploadDate" + image.id + "' class='detailItem' style='background-color:rgba(23,23,23,0.6);white-space: nowrap; '>上传日期:" + image.time + "</li><li id='subscibe" + image.id + "' class='detailItem' style='background-color:rgba(23,23,23,0.6);'>这个人很懒, 什么都没有留下:</li></ul><div id='front" + image.id + "' class='front'><img id='emotIcon" + image.id + "' class='emotIcon' src='http://tu.myway5.com/" + image.image + "'/><div class='container'><ul class='mui-table-view mui-grid-view'><li id='detailBtn' class='mui-table-view-cell mui-col-xs-3 picIcon'><i class='mui-icon iconfont icon-menu'></i></li><li class='mui-table-view-cell mui-col-xs-4 picIcon'><i class='mui-icon iconfont icon-like'></i><span>收藏</span></li><li class='mui-table-view-cell mui-col-xs-5 picIcon'><i class='mui-icon iconfont icon-thumb'></i><span>赞</span></li></ul></div></div>";
	document.getElementById(col).appendChild(picShow);
	mui(".picShow").on("tap", "#emotIcon" + image.id, function() {
		var author = document.getElementById("author" + image.id);
		var works = document.getElementById("works" + image.id);
		var uploadDate = document.getElementById("uploadDate" + image.id);
		var subscribe = document.getElementById("subscibe" + image.id);
		var detail = document.getElementById("detail" + image.id);
		var front = document.getElementById("front" + image.id);
		front.className = "blur front"
		setTimeout(function() {
			author.className = "active detailItem";
		}, 50);
		setTimeout(function() {
			works.className = "active detailItem";
		}, 100);
		setTimeout(function() {
			uploadDate.className = "active detailItem";
		}, 150);
		setTimeout(function() {
			subscribe.className = "active detailItem";
		}, 200);
	});
	mui(".picShow").on("tap", "#detail" + image.id, function() {
		var author = document.getElementById("author" + image.id);
		var works = document.getElementById("works" + image.id);
		var uploadDate = document.getElementById("uploadDate" + image.id);
		var subscribe = document.getElementById("subscibe" + image.id);
		var detail = document.getElementById("detail" + image.id);
		var front = document.getElementById("front" + image.id);
		front.className = "clear front"
		setTimeout(function() {
			author.className = "disactive detailItem";
		}, 50);
		setTimeout(function() {
			works.className = "disactive detailItem";
		}, 100);
		setTimeout(function() {
			uploadDate.className = "disactive detailItem";
		}, 150);
		setTimeout(function() {
			subscribe.className = "disactive detailItem";
		}, 200);
	});
}

function pullDownSquare() {
	setTimeout(function() {
		location.reload();
		mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
	}, 500);
}

function pullUpSquare() {
	getImages(pageNum);
	pageNum++;
	setTimeout(function() {
		mui('#refreshContainer').pullRefresh().endPullupToRefresh(noMore); //参数为true代表没有更多数据了。
	}, 500);
}

function storageInsert() {
	var picShow = document.createElement("div");
	picShow.className = "picShow";
	picShow.innerHTML = "<img class='emotIcon' src='../../img/faces/face(2).jpg' /><p class='name'><span>军火商: </span><span id='author'>叼爆炸</span> </p><div class='container'><ul class='mui-table-view mui-grid-view'><li class='mui-table-view-cell mui-col-xs-4 picIcon'><i class='mui-icon iconfont icon-menu'></i></li><li class='mui-table-view-cell mui-col-xs-4 picIcon'><i class='mui-icon iconfont icon-like'></i><span>20</span></li><li class='mui-table-view-cell mui-col-xs-4 picIcon'><i class='mui-icon iconfont icon-thumb'></i><span>35</span></li></ul></div>";
	document.getElementById("storageContainer").appendChild(picShow);
}

function pullDownStorage() {
	setTimeout(function() {
		location.reload();
		mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
	}, 200);
}

function pullUpStorage() {
	setTimeout(function() {
		for (var i = 0; i < 10; i++) {
			storageInsert();
		}
		mui('#refreshContainer').pullRefresh().endPullupToRefresh(false); //参数为true代表没有更多数据了。
	}, 200);
}
function insert() {
	var picShow = document.createElement("div");
	var leftCol = document.getElementById("leftCol").offsetHeight;
	var rightCol= document.getElementById("rightCol").offsetHeight;
	var col=(leftCol<=rightCol)?'leftCol':'rightCol';
	picShow.className = "picShow";
	picShow.innerHTML = "<img class='emotIcon' src='img/faces/face(1).jpg'/><p class='name'><span>军火商: </span><span id='author'>叼爆炸</span> </p><div class='container'><div class='picShowIcon leftIcon'><div class='threeIcon detail'></div></div><div class='picShowIcon centerIcon'><div class='threeIcon favourite'></div><p class='count'>收藏</p></div><div class='picShowIcon rightIcon'><div class='threeIcon thumb'></div><p class='count'>赞</p></div></div>";
	document.getElementById(col).appendChild(picShow);
}
mui.init({
	pullRefresh: {
		container: "#refreshContainer",
		down: {
			contentdown: "下拉可以刷新",
			contentover: "释放立即刷新",
			contentrefresh: "正在刷新...",
			callback: pullDown
		},
		up: {
			contentrefresh: "正在加载...",
			contentnomore: '没有更多数据了',
			callback: pullUp
		}
	}
});

function pullDown() {
	mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
}

function pullUp() {
	insert();
	this.endPullupToRefresh(false);
}
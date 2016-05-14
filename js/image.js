var imageUrl = null;
mui.init();
mui.plusReady(function() {
	plus.share.getServices(function(s) {
		shares = s;
		for (var i in s) {
			if ('weixin' == s[i].id) {
				sharewx = s[i];
			}
		}
	}, function(e) {
		mui.toast("获取失败");
		//alert("获取分享服务列表失败" + e.message);
	});
	mui("body").on("tap", "#back", function() {
		mui.back();
	});
	mui("body").on("tap", "#shareWechat", function() {
		shareWechat();
	});
	mui("body").on("tap", "#shareWechatFriends", function() {
		shareWechatFriends();
	});
	mui("body").on("tap", "#shareQQ", function() {});
});

function shareWechatFriends() {
	sharewx.send({
		content: "有了表情军工厂, 斗图还有谁?!",
		href: "www.vigorwww.com:8080/Optimus",
		thumbs: "../../img/qq.png",
		extra: {
			scene: "WXSceneTimeline"
		}
	}, function() {
		mui.toast("分享成功！");
	}, function(e) {
		mui.toast("分享失败");
	});
}

function shareWechat() {
	var shareContent = "有了表情军工厂, 斗图还有谁?!";
	var picture = imageUrl;
	var msg = {
		content: shareContent,
		pictures: [picture],
		extra: {
			scene: "WXSceneSession"
		}
	}
	sharewx.send(msg, function() {
		mui.toast("分享成功！");
	}, function(e) {
		console.log("分享失败" + e.message);
	});
}

function initial(dataJson) {
	var data = JSON.parse(dataJson);
	var title = document.getElementById("title");
	var producerName = document.getElementById("producerName");
	var image = document.getElementById("image");
	var likeCount = document.getElementById("likeCount");
	var thumbCount = document.getElementById("thumbCount");
	title.innerText = data.title;
	producerName = data.author;
	image.src = data.url;
	imageUrl = data.url;
	likeCount.innerText = (data.likeCount > 0) ? data.likeCount : "收藏";
	thumbCount.innerText = (data.thumbCount > 0) ? data.thumbCount : "赞";
}
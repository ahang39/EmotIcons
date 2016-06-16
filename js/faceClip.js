var canvas = null;
var width = 375;
var height = 400;
var range = null;
var originData = null;
var ctx = null;
var faceSavePath = "";
mui.plusReady(function() {
	/*width = plus.display.resolutionWidth;
	height = plus.display.resolutionHeight - 300;*/
	initial();
	mui("body").on("tap", "#removeAll", function() {
		removeAll();
	});
	mui("body").on("tap", "#imageSelect", function() {
		imageSelect();
	});
	mui("body").on("tap", "#save", function() {
		clipFace();
	});
	mui("body").on("tap", "#confirm", function() {
		document.getElementById("rangeWrapper").style.visibility = "visible";
		getTransparent(document.getElementById("transparentRange").value);
	});
});

function clipFace() {
	getTransparent(document.getElementById("transparentRange").value);
	getRealFace();
	save();
	setTimeout(function() {
		var maker = plus.webview.getWebviewById("maker");
		maker.evalJS("addImage(\"" + faceSavePath + "\");");
		plus.webview.show(maker, "zoom-fade-out");
	}, 500);
}

function initial() {
	canvas = new fabric.Canvas('maker', {
		selection: false //禁止拖选
	});
	canvas.setWidth(width);
	canvas.setHeight(height);
	canvas.setBackgroundColor('rgba(255,255,255, 255)');
	ctx = canvas.getContext();

	range = document.getElementById("transparentRange");
	range.addEventListener("input", function() {
		getTransparent(this.value);
	});
	originData = ctx.createImageData(width, height);
	var length = originData.length;
	for (var i = 0; i < length; i += 4) {
		originData.data[i + 0] = 255;
		originData.data[i + 1] = 255;
		originData.data[i + 2] = 255;
		originData.data[i + 3] = 0;
	}
	canvas.on("mouse:up", function() {
		var imgData = ctx.getImageData(0, 0, width, height).data;
		var length = imgData.length;
		for (var i = 0; i < length; i++) {
			originData.data[i] = imgData[i];
		}
	});
	canvas.on("after:render", function() {
		document.getElementById("rangeWrapper").style.visibility = "hidden";
		drawContour(0.6);
	});
	canvas.renderAll();
}

function drawContour(transparent) {
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.moveTo(0.24 * width, 0);
	ctx.lineTo(0.24 * width, 0.3 * height);

	ctx.bezierCurveTo(
		0.24 * width, 0.675 * height, //上
		0.467 * width, 0.7125 * height, //下
		0.5 * width, 0.71 * height); //底部
	ctx.bezierCurveTo(
		0.533 * width, 0.7125 * height, //下
		0.76 * width, 0.675 * height, //上
		0.76 * width, 0.3 * height); //顶部
	ctx.bezierCurveTo(
		0.747 * width, 0.15 * height, //右
		0.253 * width, 0.15 * height, //左
		0.24 * width, 0.3 * height); //左点
	ctx.lineTo(0.24 * width, 0.3 * height);
	ctx.lineTo(0.24 * width, 0);
	ctx.lineTo(width, 0);
	ctx.lineTo(width, height);
	ctx.lineTo(0, height);
	ctx.lineTo(0, 0);
	ctx.closePath();
	ctx.fillStyle = "rgba(0,0,0," + transparent + ")";
	ctx.fill();
}

function getTransparent(threshold) {
	var imgData = originData.data;
	var newImage = ctx.createImageData(width, height);
	var newImageData = newImage.data;
	var length = newImageData.length;
	for (var i = 0; i < length; i += 4) {
		var r = imgData[i + 0];
		var g = imgData[i + 1];
		var b = imgData[i + 2];
		var a = imgData[i + 3];
		//var y = Y = 0.299 * r + 0.587 * g + 0.114 * b;
		var y = (r + g + b) / 3;
		newImageData[i + 0] = 0;
		newImageData[i + 1] = 0;
		newImageData[i + 2] = 0;
		if (y > threshold)
			newImageData[i + 3] = 0;
		else
			newImageData[i + 3] = 255 - y * 255 / threshold;

	}
	ctx.clearRect(0, 0, width, height);
	ctx.putImageData(newImage, 0, 0);
	drawContour(1);
}

function save() {
	canvas.deactivateAll();
	var imageData = ctx.getImageData(0.24 * width, 0.18 * height, 0.52 * width, 0.55 * height);
	var newCanvas = document.createElement("canvas");
	newCanvas.width = 0.52 * width;
	newCanvas.height = 0.55 * height;
	newCanvas.getContext("2d").putImageData(imageData, 0, 0);
	var dataURL = newCanvas.toDataURL("image/png");
	var bitmap = new plus.nativeObj.Bitmap();
	bitmap.loadBase64Data(dataURL, function() {}, function(e) {
		console.log("failed" + JSON.stringify(e));
	});
	var time = new Date();
	var second = time.getTime();
	path = "_doc/picture/emoticon" + second + ".png";
	bitmap.save(path, {}, function(i) {
		console.log('保存图片成功：' + i.target);
		faceSavePath = i.target;
		removeAll(); //清空画布
	}, function(e) {
		console.log('保存图片失败：' + JSON.stringify(e));
	});
}

function getRealFace() {
	console.log("test");
	ctx.beginPath();
	ctx.moveTo(0.24 * width, 0.3 * height);
	ctx.bezierCurveTo(
		0.24 * width, 0.675 * height, //上
		0.467 * width, 0.7125 * height, //下
		0.5 * width, 0.71 * height); //底部
	ctx.bezierCurveTo(
		0.533 * width, 0.7125 * height, //下
		0.76 * width, 0.675 * height, //上
		0.76 * width, 0.3 * height); //顶部
	ctx.bezierCurveTo(
		0.747 * width, 0.15 * height, //右
		0.253 * width, 0.15 * height, //左
		0.24 * width, 0.3 * height); //左点

	var imgData = ctx.getImageData(0, 0, width, height).data;
	var newImage = ctx.createImageData(width, height);
	var newImageData = newImage.data;
	var length = newImageData.length;
	for (var i = 0; i < length; i += 4) {
		var r = imgData[i + 0];
		var g = imgData[i + 1];
		var b = imgData[i + 2];
		var a = imgData[i + 3];
		var x = i / 4 % width;
		var y = (i / 4 - (i / 4 % width)) / width;
		if (!ctx.isPointInPath(x + 1, y) || !ctx.isPointInPath(x - 1, y) || !ctx.isPointInPath(x, y + 1) || !ctx.isPointInPath(x, y - 1)) {
			newImageData[i + 0] = 0;
			newImageData[i + 1] = 0;
			newImageData[i + 2] = 0;
			newImageData[i + 3] = 0;
		} else {
			newImageData[i + 0] = r;
			newImageData[i + 1] = g;
			newImageData[i + 2] = b;
			newImageData[i + 3] = a;
		}
	}
	ctx.clearRect(0, 0, width, height);
	ctx.putImageData(newImage, 0, 0);
}

function addImage(src, wid) {
	if (!arguments[1]) wid = width * 0.7;
	fabric.Image.fromURL(src, function(img) {
		wid = img.getWidth() > wid ? wid : img.getWidth();
		img.scaleToWidth(wid).set({
			left: 10,
			top: 10,
			transparentCorners: true
		});
		canvas.add(img).setActiveObject(img);
	});
	canvas.renderAll();
}

function imageSelect() {
	var bts = [{
		title: "拍照"
	}, {
		title: "本地相册"
	}];
	plus.nativeUI.actionSheet({
			title: "插入图片",
			cancel: "取消",
			buttons: bts
		},
		function(e) {
			if (e.index == 1)
				takePicture();
			else if (e.index == 2)
				getFromAlbum();
		}
	);
}

function getFromAlbum() {
	canvas.clear();
	plus.gallery.pick(function(path) {
		time = new Date();
		second = time.getTime();
		dst = "_doc/material/other/" + second + ".jpg";
		compressImage(path, dst);
	}, function(e) {
		mui.toast("取消选择图片");
	}, {
		filter: "image"
	});
}

function compressImage(src, dst) {
	plus.io.resolveLocalFileSystemURL(src, function(fileEntry) {
		var quality = 20;
		fileEntry.file(function(file) {
			if (file.size / 1024 > 250) {
				quality = 20;
			} else {
				quality = 100;
			}
			plus.zip.compressImage({
					src: src,
					dst: dst,
					quality: quality
				},
				function() {
					addImage(plus.io.convertLocalFileSystemURL(dst)); //压缩成功后加载到页面上
				},
				function(error) {
					alert("Compress error!");
				});
		}, function(e) {
			console.log(e.message);
		});
	}, function(e) {
		console.log(e.message);
	});

}

function takePicture() {
	var cmr = plus.camera.getCamera();
	var res = cmr.supportedImageResolutions[0];
	var fmt = cmr.supportedImageFormats[0];
	console.log("Resolution: " + res + ", Format: " + fmt);
	cmr.captureImage(function(path) {
			//alert("Capture image success: " + path);
			path = path.substring(1, path.length);
			path = "_" + path;
			time = new Date();
			second = time.getTime();
			dst = "_doc/material/other/" + second + ".jpg";
			//将相机照片压缩并添加到素材的other文件夹中
			compressImage(path, dst);
		},
		function(error) {
			mui.toast("获取图片失败!");
		}, {
			format: fmt
		}
	);
}

function convertCanvasToImage() {
	var image = new Image();
	image.src = canvas.toDataURL();
	return image;
}

function removeAll() {
	canvas.clear();
}
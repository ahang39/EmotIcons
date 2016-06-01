var canvas = null;
var width = 375;
var height = 400;
var saveOption = false;
mui.plusReady(function() {
	var width = plus.display.resolutionWidth;
	var height = plus.display.resolutionHeight - 350;
	initial();
	mui("body").on("tap", "#removeAll", function() {
		removeAll();
	});
	mui("body").on("tap", "#imageSelect", function() {
		imageSelect();
	});
	mui("body").on("tap", "#testme", function() {
		testme();
	});
	mui("body").on("tap", "#save", function() {
		save();
	});
});


function testme() {
	var ctx = canvas.getContext();
	var imgData = ctx.getImageData(0, 0, width, height).data;
	var newImage = ctx.createImageData(width, height);
	var newImageData = newImage.data;
	var length = newImageData.length;
	for (var i = 0; i < length; i += 4) {
		var r = imgData[i + 0];
		var g = imgData[i + 1];
		var b = imgData[i + 2];
		var a = imgData[i + 3];
		var y = Y = 0.299 * r + 0.587 * g + 0.114 * b;
		//var y = (r + g + b) / 3;
		newImageData[i + 0] = 0;
		newImageData[i + 1] =0;
		newImageData[i + 2] = 0;
		newImageData[i + 3] =255-y;
		/*
		if (y >100)
			newImageData[i + 3] =255;
		else
			newImageData[i + 3] =0;*/
	}
	//canvas.on('after:render', function(e) {
		ctx.clearRect(0, 0, width, height);
		ctx.putImageData(newImage, 0, 0);
	//});
}
function initial() {
	canvas = new fabric.Canvas('maker', {
		selection: false //禁止拖选
	});
	canvas.on("selection:cleared", function() {
		console.log("cleared");
		isText = null;
		selectedItem = null;
	});
	canvas.on("object:selected", function() {
		selectedItem = canvas.getActiveObject();
		//console.log(selectedItem);
	});
	canvas.setWidth(width);
	canvas.setHeight(height);
	canvas.setBackgroundColor('rgba(255,255,255, 255)');
	canvas.renderAll();
}

function removeAll() {
	canvas.clear();
}

function saveToAlbum(filepath) {
	plus.gallery.save(filepath, function() {
		console.log("保存图片到相册");
		mui.toast("保存图片到相册成功");
	}, function(e) {
		console.log("failed" + JSON.stringify(e));
	});
}

function save() {
	var filepath;
	var bts = [{
		title: "保存"
	}, {
		title: "保存并共享"
	}];
	plus.nativeUI.actionSheet({
			title: "保存图片",
			cancel: "取消",
			buttons: bts
		},
		function(e) {
			if (e.index == 1)
				saveOption = false;
			else if (e.index == 2)
				saveOption = true;
			if (e.index != -1) {
				canvas.deactivateAll();
				var bitmap = new plus.nativeObj.Bitmap();
				var clipJson = getClipJson();
				var dataURL = canvas.toDataURL({
					format: 'png',
					left: clipJson.left,
					top: clipJson.top,
					width: clipJson.width,
					height: clipJson.height
				});
				bitmap.loadBase64Data(dataURL, function() {
					//console.log("success");
				}, function(e) {
					console.log("failed" + JSON.stringify(e));
				});
				var time = new Date();
				var second = time.getTime();
				path = "_doc/picture/emoticon" + second + ".png";
				bitmap.save(path, {}, function(i) {
					console.log('保存图片成功：' + i.target);
					filepath = i.target;
					saveToAlbum(filepath); //加载到相册
					saveData(filepath, JSON.stringify(canvas.toJSON()));
					removeAll(); //清空画布
				}, function(e) {
					console.log('保存图片失败：' + JSON.stringify(e));
				});
			}
		}
	);

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
			path = "../../../" + path;
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
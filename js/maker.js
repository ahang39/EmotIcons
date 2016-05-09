var canvas = null;
var selectedItem = null; //保存当前选中的对象
var isText = false;
var width = 400;
var height = 350;
var filepath;
mui.plusReady(function() {
	initial();
});

function initial() {
	canvas = new fabric.Canvas('maker', {
		selection: false //禁止拖选
	});
	canvas.on("selection:cleared", function() {
		console.log("cleared");
		isText=null;
		selectedItem=null;
	});
	canvas.on("object:selected", function() {
		selectedItem=canvas.getActiveObject();
		console.log(selectedItem);
	});
	canvas.setBackgroundColor("white");
	canvas.setWidth(width);
	canvas.setHeight(height);
	canvas.renderAll();
}

function flipX() {
	if (selectedItem) {
		var isFlipX = selectedItem.getFlipX();
		selectedItem.set("flipX", isFlipX ? false : true);
	}
	canvas.renderAll();
}

function bringForward() {
	if (selectedItem) {
		selectedItem.bringForward();
		canvas.renderAll();
	}
}

function sendBackward() {
	if (selectedItem) {
		selectedItem.sendBackwards();
		canvas.renderAll();
	}
}

function removeItem() {
	if (selectedItem) {
		selectedItem.remove();
		canvas.renderAll();
	}
}

function removeAll() {
	canvas.clear();
}

function saveToAlbum() {
	save();
	plus.gallery.save(filepath, function() {
		mui.toast("保存图片到相册成功");
	}, function(e) {
		console.log("failed" + JSON.stringify(e));
	});
}

function save() {
	canvas.deactivateAll();
	var bitmap = new plus.nativeObj.Bitmap();
	var dataURL = canvas.toDataURL({
		format: 'png'
	});
	bitmap.loadBase64Data(dataURL, function() {
		console.log("success");
	}, function(e) {
		console.log("failed" + JSON.stringify(e));
	});
	var time = new Date();
	var second = time.getTime();
	path = "_doc/emoticon" + second + ".png";
	bitmap.save(path, {}, function(i) {
		console.log('保存图片成功：' + i.target);
		filepath=  i.target;
	}, function(e) {
		console.log('保存图片失败：' + JSON.stringify(e));
	});
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
		img.on("selected", function() {
			selectedItem = this;
			isText = false;
		});
		canvas.add(img).setActiveObject(img);
	});
	canvas.renderAll();
}

function addText(flag) {
	var input = document.getElementById("text_input");
	var text = input.value;
	var text = new fabric.Text(text, {
		left: 100,
		top: 100,
		fontFamily: 'Comic Sans',
		fontSize: 40,
		fontWeight: 'normal',
		shadow: 'green -5px -5px 3px',
		fontStyle: 'normal',
		textBackgroundColor: 'rgb(0,200,0)'
	});
	text.on('selected', function() {
		document.getElementById("text_change").value = this.getText();
		selectedItem = this;
		isText = true;
	});
	canvas.add(text);
	canvas.renderAll();
}

function changeText() {
	if (isText) {
		var changeText = document.getElementById("text_change").value;
		selectedItem.setText(changeText);
		canvas.renderAll();
	}
}

function changeTextColor(obj) {
	if (isText) {
		selectedItem.setColor(obj.style.backgroundColor);
		canvas.renderAll();
	}
}

function changeTextBackgroundColor(obj) {
	if (isText) {
		selectedItem.setTextBackgroundColor(obj.style.backgroundColor);
		canvas.renderAll();
	}
}

function changeTextShadowColor(obj) {
	if (isText) {
		selectedItem.setTextBackgroundColor(obj.style.backgroundColor);
		canvas.renderAll();
	}
}

function changeTextFontFamily(obj) {
	if (isText) {
		console.log(obj.style.fontFamily);
		selectedItem.setFontFamily(obj.style.fontFamily);
		canvas.renderAll();
	}
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
		addImage(path);
	}, function(e) {
		mui.toast("取消选择图片");
	}, {
		filter: "image"
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
			addImage(path);
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
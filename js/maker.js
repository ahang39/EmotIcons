var canvas = null;
var selectedItem = null; //保存当前选中的对象
var isText = false;
var width = 400;
var height = 350;
var path;
mui.plusReady(function() {
	initial();
});

function initial() {
	canvas = new fabric.Canvas('maker', {
		selection: false //禁止拖选
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
		selectedItem = null;
		isText = false;
	}
}

function removeAll() {
	canvas.clear();
	selectedItem = null;
	isText = false;
}

function saveToAlbum() {
	save();
	plus.gallery.save(path, function() {
		alert("保存图片到相册成功");
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
		console.log('保存图片成功：' + JSON.stringify(i));
	}, function(e) {
		console.log('保存图片失败：' + JSON.stringify(e));
	});
	path = path.substring(1, path.length);
	path = "../../../" + path;
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

function addText() {
	mui.prompt("文字","新建文字",['确定',"取消"],function(e){
		if(e.index==0){
			console.log(e.value))
		}
	});
	var input = document.getElementById("text_input");
	var text = input.value;
	var text = new fabric.Text(text, {
		left: 100,
		top: 100,
		fontFamily: 'Comic Sans',
		fontSize: 40,
		fontWeight: 'normal',
		fontStyle: 'normal',
		textBackgroundColor: 'rgb(255,255,255)'
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
		selectedItem.setShadow({
		  color: obj.style.backgroundColor,
		  blur: 10,
		  offsetX: 2,
		  offsetY: 2
		});
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

function changeTextFontEffect(obj){
	if(isText){
		console.log(obj.style.textShadow);
		selectedItem.setShadow('2px 2px 10px rgba(0,0,0,0.2)');
		selectedItem.setStroke('red');
		selectedItem.setStrokeWidth("1px");
		canvas.renderAll();
	}
}
function changeTextFontStyle(obj){
	if(isText){
		console.log(obj.style.fontStyle);
		selectedItem.setFontStyle(obj.style.fontStyle);
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
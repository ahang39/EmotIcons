var canvas = null;
var selectedItem = null; //保存当前选中的对象
var isText = false;
var width = window.screen.width;
var height = document.height;

mui.plusReady(function() {
	console.log(width);
	canvas = new fabric.Canvas('maker');
	canvas.setBackgroundColor("white");
	canvas.renderAll();
	//initial();
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

function test() {
var dataURL = canvas.toDataURL({
  format: 'png',
  left: 100,
  top: 100,
  width: 200,
  height: 200
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
			alert(error.message);
		}, {
			resolution: "480*320",
			format: fmt
		}
	);
}

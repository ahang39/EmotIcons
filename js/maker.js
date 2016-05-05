var canvas = null;
var selectedItem = null; //保存当前选中的对象
var isText = false;

mui.plusReady(function() {
	canvas = new fabric.Canvas('maker');
});

function bringForward() {
	if (selectedItem) {
		selectedItem.bringToFront();
		canvas.renderAll();
	}
}

function sendBackward() {
	if (selectedItem) {
		selectedItem.sendToBack();
		canvas.renderAll();
	}
}

function removeItem() {
	if (selectedItem) {
		selectedItem.remove();
		canvas.renderAll();
	}
}

function paintImage(obj) {
	fabric.Image.fromURL(obj.src, function(img) {
		img.scale(1).set({
			left: 10,
			top: 10,
			borderColor: 'red',
			cornerColor: 'green',
			cornerSize: 20,
			transparentCorners: false
		});
		canvas.add(img).setActiveObject(img);
		selectedItem = img;
		img.on("selected", function() {
			selectedItem = this;
			isText = false;
		});
	});
	canvas.renderAll();
}

function finishText(flag) {
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
var canvas = null;
var selectedItem = null; //保存当前选中的对象
var isText = false;
var width = 400;
var height = 350;
mui.plusReady(function() {
	width=plus.screen.resolutionWidth;
	height=plus.screen.resolutionHeight-350;
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
		//console.log(selectedItem);
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

function saveToAlbum(filepath) {
	plus.gallery.save(filepath, function() {
		console.log("保存图片到相册");
		mui.toast("保存图片到相册成功");
	}, function(e) {
		console.log("failed" + JSON.stringify(e));
	});
}

function saveToClound(filepath){
	var task = plus.uploader.createUpload( "http://tu.myway5.com/php/index.php", 
		{ method:"POST",blocksize:204800,priority:100 },
		function ( t, status ) {
			// 上传完成
			if ( status == 200 ) { 
				console.log(t.responseText);
				alert( "Upload success: " + t.url );
			} else {
				alert( "Upload failed: " + status );
			}
		}
	);
	task.addFile(filepath, {key:"file"} );
	task.addFile(filepath, {key:"file_src"} );
	//task.addFile( filepath, {key:"file"} );
	console.log(filepath);
	task.addData( "action", "datasync_action" );
	task.addData( "sub_action", "fileUpload" );
	//task.addEventListener( "statechanged", onStateChanged, false );
	task.start();
}

function save() {
	var saveOption=false;
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
				saveOption=false;
			else if (e.index == 2)
				saveOption=true;
			canvas.deactivateAll();
			var bitmap = new plus.nativeObj.Bitmap();
			console.log(JSON.stringify(canvas.toJSON()));
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
				saveToAlbum(filepath);
				if(saveOption){
					saveToClound(filepath);
				}
			}, function(e) {
				console.log('保存图片失败：' + JSON.stringify(e));
			});
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
		img.on("selected", function() {
			selectedItem = this;
			isText = false;
			document.getElementById("image_option").className="mui-control-item mui-active";
			document.getElementById("text_option").className="mui-control-item";
			document.getElementById("item1").className="mui-control-content maker_img mui-active";
			document.getElementById("item2").className="mui-control-content maker_img";
		});
		canvas.add(img).setActiveObject(img);
	});
	canvas.renderAll();
}

function addText() {
	var bts=["确认","取消"];
		plus.nativeUI.prompt("新建文字",function(e){
			if(e.index==0){
				var mText = e.value;
				var text = new fabric.Text(mText, {
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
					document.getElementById("image_option").className="mui-control-item";
					document.getElementById("text_option").className+=" mui-active";
					document.getElementById("item1").className="mui-control-content maker_img";
					document.getElementById("item2").className="mui-control-content mui-active maker_img";
				});
				canvas.add(text);
				canvas.renderAll();
			}
		},"","新建文字",bts);
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

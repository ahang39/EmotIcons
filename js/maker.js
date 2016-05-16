var canvas = null;
var selectedItem = null; //保存当前选中的对象
var isText = false;
var width=400;
var height=350;
var saveOption = false;
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
		isText = null;
		selectedItem = null;
	});
	canvas.on("object:selected", function() {
		selectedItem = canvas.getActiveObject();
		//console.log(selectedItem);
	});
	canvas.setBackgroundColor("white");
	canvas.setWidth(width);
	canvas.setHeight(height);
	canvas.setBackgroundColor('rgba(255, 73, 64, 0.0)');
	if(isEditMode){
		canvas.loadFromJSON(json);//从tempMaker中加载dat数据
	}
	canvas.renderAll();
	getImageItem();
}

//适配器，将从网络中加载的dat文件修改成可用的dat文件，主要工作是更改本地的图片地址
function adapter(){
	var str="";
	plus.io.resolveLocalFileSystemURL("_doc",function(fs){
		fs.getDirectory("material/expression",{create:false},function(dir){
			var directoryReader=dir.createReader();
			directoryReader.readEntries(function(entries){
				for(i=0;i<entries.length,i++){
					if(entries[i].name.match(".dat")){
						dir.getFile(entries[i].name,{create:false},
							function(fileEntry){
								reader=new plus.io.FileReader();
								reader.onloadend = function ( e ) {
									console.log( e.target.result);
								};
								reader.readAsText( fileEntry,"UTF-8");
							},function(e){console.log(e.message);});
					}
				}
			})
		});
	});
}

function test() {
	console.log(canvas.backgroundColor);
}
//动态添加图片素材到制作器内
function getImageItem(){
	var str="";
	plus.io.resolveLocalFileSystemURL("_doc",function(fs){	
		fs.getDirectory("material/expression",{create:false},function(dir){
			var directoryReader = dir.createReader();
			directoryReader.readEntries(function(entries) {
				for (i = 0; i < entries.length; i++) {
					str = str + "<td><img onclick='addImage(this.src)' src=" + entries[i].fullPath + "></td>";
				}
						
				fs.getDirectory("material/face",{create:false},function(dir){
					var directoryReader = dir.createReader();
					directoryReader.readEntries(function(entries){
						for( i=0; i < entries.length; i++ ) {
							str=str+"<td><img onclick='addImage(this.src)' src="+entries[i].fullPath+"></td>";
						}
						fs.getDirectory("material/other",{create:false},function(dir){
							var directoryReader = dir.createReader();
							directoryReader.readEntries(function(entries) {
								for (i = 0; i < entries.length; i++) {
									str = str + "<td><img onclick='addImage(this.src)' src=" + entries[i].fullPath + "></td>";
								}
								document.getElementById("img_item").innerHTML=str;
							},function(e){
								console.log(e.message);
							});
						},function(e){
							console.log(e.message);
						});
					},function(e){
						console.log(e.message);
					});
				},function(e){
					console.log(e.message);
				});
		
			},function(e){
				console.log(e.message);
			});
		},function(e){
			console.log(e.message);
		});

	});
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

function removeTempMaker(){
	plus.io.resolveLocalFileSystemURL("_doc/tempMaker",function(dirEntry){
			dirEntry.removeRecursively(function(dir){
				plus.io.resolveLocalFileSystemURL( "_doc", function ( entry ) {
					entry.getDirectory("tempMaker",{create:true,exclusive:false},function(mdir){
						console.log("创建tempMaker成功");
					},function(){
						console.log("创建tempMaker失败");
					});
				},function(e){
					console.log(e.message+"获取doc出错");
				});
			},function(e){console.log(e.message+"删除出错");});
		},function(e){
			console.log(e.message);
		});
}

function removeAll() {
	canvas.clear();
}
//用来保存所有制作中用到的素材图片到临时文件夹
function saveTempFile(src, callback) {
	plus.io.resolveLocalFileSystemURL(src, function(file) {
		plus.io.resolveLocalFileSystemURL("_doc/tempMaker", function(dir) {
			file.copyTo(dir, file.name, function(dirEntry) {
				callback
			}, function(e) {
				console.log(e.message)
			});
		}, function(e) {
			console.log(e.message);
		})
	}, function(e) {
		console.log(e.message);
	});
}

function saveToAlbum(filepath) {
	plus.gallery.save(filepath, function() {
		console.log("保存图片到相册");
		mui.toast("保存图片到相册成功");
	}, function(e) {
		console.log("failed" + JSON.stringify(e));
	});
}
//上传成功时的回调函数，这里要清空tempMaker文件夹
function onStateChanged(upload,status){
	if ( upload.state == 4 && status == 200 ) {
		removeTempMaker();
	}
}

//保存到服务器时，需要将素材和canvas数据同时传到服务器上，以实现其他人改图的功能
function saveToCloud(filepath, localDataPath) {
	src = "_doc/tempMaker";
	date = new Date();
	second = date.getTime();
	zipFile = "_doc/resource/src" + second;
	plus.zip.compress(src, zipFile, function() {
		var task = plus.uploader.createUpload("http://tu.myway5.com/php/index.php", {
				method: "POST",
				blocksize: 204800,
				priority: 100
			},
			function(t, status) {
				console.log(t.responseText);
				if ( status == 200 ) { 
					responData=JSON.parse(t.responseText);
					if(responData.online=="false"){
						alert("尚未登录");
					}else if(responData.upload_status=="success")
						alert("上传成功");
					else
						alert("上传失败");
				} else {
					alert("Upload failed: " + status);
				}
			}
		);
		task.addFile(filepath, {
			key: "file"
		});
		task.addFile(zipFile + ".zip", {
			key: "file_src"
		});
		//task.addFile( filepath, {key:"file"} );
		console.log("回调成功" + zipFile);
		task.addData("action", "datasync_action");
		task.addData("sub_action", "fileUpload");
		task.addData("localDataPath", localDataPath);
		task.addEventListener("statechanged", onStateChanged, false);
		task.start();
	}, function(e) {
		console.log(e.message)
	});

}

//保存图片制作的数据，包括图片地址，canvas数据
function saveData(path, data) {
	plus.io.resolveLocalFileSystemURL("_doc", function(entry) {
		var w = null;
		var time = new Date();
		var second = time.getTime();
		var localDataPath = "data/" + second + ".dat";
		entry.getFile(localDataPath, {
			create: true
		}, function(fileEntry) {
			fileEntry.createWriter(function(writer) {
				w = writer;
				w.write(path + "\n" + data);
				writer.onwrite = function(e) {
					if (saveOption) {
						saveTempFile("_doc/" + localDataPath, saveToCloud(path, localDataPath)); //保存数据到临时目录
						//这里存在服务器文件与本地文件对应的问题，
						//解决办法就是
						//将本地data路径传到服务器上保存，获取数据时查看这个路径是否存在文件
						//若存在则不下载图片，直接使用本地图片
					}else{
						removeTempMaker();
					}
				};
			});
		});

	}, function(e) {
		console.log(e.message);
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
			canvas.deactivateAll();
			var bitmap = new plus.nativeObj.Bitmap();
			var dataURL = canvas.toDataURL({
				format: 'png'
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
				filepath=  i.target;
				saveToAlbum(filepath);//加载到相册
				saveData(filepath,JSON.stringify(canvas.toJSON()));
				removeAll();//清空画布
			}, function(e) {
				console.log('保存图片失败：' + JSON.stringify(e));
			});
		}
	);

}

function addImage(src, wid) {
	saveTempFile(src);
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
			document.getElementById("image_option").className = "mui-control-item mui-active";
			document.getElementById("text_option").className = "mui-control-item";
			document.getElementById("item1").className = "mui-control-content maker_img mui-active";
			document.getElementById("item2").className = "mui-control-content maker_img";
		});
		canvas.add(img).setActiveObject(img);
	});
	canvas.renderAll();
}

function addText() {
	var bts = ["确认", "取消"];
	plus.nativeUI.prompt("新建文字", function(e) {
		if (e.index == 0) {
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
				document.getElementById("image_option").className = "mui-control-item";
				document.getElementById("text_option").className += " mui-active";
				document.getElementById("item1").className = "mui-control-content maker_img";
				document.getElementById("item2").className = "mui-control-content mui-active maker_img";
			});
			canvas.add(text);
			canvas.renderAll();
		}
	}, "", "新建文字", bts);
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

function changeTextFontEffect(obj) {
	if (isText) {
		console.log(obj.style.textShadow);
		selectedItem.setShadow('2px 2px 10px rgba(0,0,0,0.2)');
		selectedItem.setStroke('red');
		selectedItem.setStrokeWidth("1px");
		canvas.renderAll();
	}
}

function changeTextFontStyle(obj) {
	if (isText) {
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

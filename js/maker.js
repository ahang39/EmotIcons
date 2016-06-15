var canvas = null;
var selectedItem = null; //保存当前选中的对象
var isText = false;
var width = 375;
var height = 350;
var saveOption = false;
mui.plusReady(function() {
	var width = plus.display.resolutionWidth;
	var height = plus.display.resolutionHeight - 350;
	initial();
	mui("body").on("tap", "#removeAll", function() {
		removeAll();
	});
	mui("body").on("tap", "#addText", function() {
		addText();
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
	mui("body").on("tap", "#flipX", function() {
		flipX();
	});
	mui("body").on("tap", "#bringForward", function() {
		bringForward();
	});
	mui("body").on("tap", "#sendBackward", function() {
		sendBackward();
	});
	mui("body").on("tap", "#removeItem", function() {
		removeItem();
	});
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
	canvas.setWidth(width);
	canvas.setHeight(height);
	canvas.setBackgroundColor('rgba(0, 0, 0, 0)');
	canvas.renderAll();
	getImageItem();
}
//适配器，将从网络中加载的dat文件修改成可用的dat文件，主要工作是更改本地的图片地址
function adapter() {
	var str = "";
	plus.io.resolveLocalFileSystemURL("_doc", function(fs) {
		fs.getDirectory("tempMaker/tempMaker", {
			create: false
		}, function(dir) {
			var directoryReader = dir.createReader();
			directoryReader.readEntries(function(entries) {
				for (i = 0; i < entries.length; i++) {
					if (entries[i].name.match(".txt")) {
						dir.getFile(entries[i].name, {
								create: false
							},
							function(fileEntry) {
								reader = new plus.io.FileReader();
								reader.onloadend = function(e) {
									dataText = e.target.result; //读取到dat文件的内容
									dataArray = dataText.split("\n");
									canvasData = dataArray[1]; //获取canvas的布局数据

									canvas.loadFromJSON(canvasData);
								};
								reader.readAsText(fileEntry, "UTF-8");
							},
							function(e) {
								console.log(e.message);
							});
					}
				}
			});
		});
	});
}

function getEditorArguments(src, localDataPath) {
	if (src != "" && localDataPath != "") {
		//从网络中加载资源到tempMaker中并解压
		console.log("http://tu.myway5.com" + src);
		removeTempMaker();
		console.log("删除成功");
		plus.io.resolveLocalFileSystemURL("_doc/temp.zip", function(file) {
				file.remove( function ( entry ) {
					console.log("删除成功");
					var dtask = plus.downloader.createDownload("http://tu.myway5.com" + src, {
							method: "GET",
							filename: "_doc/temp.zip",
							timeout: 5000
						},
						function(d, status) {
							// 下载完成
							if (status == 200) {
								console.log("下载成功");
								plus.zip.decompress("_doc/temp.zip", "_doc/tempMaker", function() {
									adapter();
								}, function(e) {
									console.log(e.message);
								});
							} else {
								alert("Download failed: " + status);
							}
						});
					//dtask.addEventListener( "statechanged", onStateChanged, false );
					dtask.start();
				}, function ( e ) {
					alert( e.message );
				} );
			},function(e){
				console.log(e.message);
			});
		
	}
}

//动态添加图片素材到制作器内
function getImageItem() {
	var str = "";
	plus.io.resolveLocalFileSystemURL("_doc", function(fs) {
		fs.getDirectory("material/expression", {
			create: false
		}, function(dir) {
			var directoryReader = dir.createReader();
			directoryReader.readEntries(function(entries) {
				for (i = 0; i < entries.length; i++) {
					str = str + "<td><img onclick='addImage(this.src)' src=" + entries[i].fullPath + "></td>";
				}

				fs.getDirectory("material/face", {
					create: false
				}, function(dir) {
					var directoryReader = dir.createReader();
					directoryReader.readEntries(function(entries) {
						for (i = 0; i < entries.length; i++) {
							str = str + "<td><img onclick='addImage(this.src)' src=" + entries[i].fullPath + "></td>";
						}
						fs.getDirectory("material/other", {
							create: false
						}, function(dir) {
							var directoryReader = dir.createReader();
							directoryReader.readEntries(function(entries) {
								for (i = 0; i < entries.length; i++) {
									str = str + "<td><img onclick='addImage(this.src)' src=" + entries[i].fullPath + "></td>";
								}
								document.getElementById("img_item").innerHTML = str;
							}, function(e) {
								console.log(e.message);
							});
						}, function(e) {
							console.log(e.message);
						});
					}, function(e) {
						console.log(e.message);
					});
				}, function(e) {
					console.log(e.message);
				});

			}, function(e) {
				console.log(e.message);
			});
		}, function(e) {
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

function removeTempMaker() {
	plus.io.resolveLocalFileSystemURL("_doc/tempMaker", function(dirEntry) {
		dirEntry.removeRecursively(function(dir) {
			plus.io.resolveLocalFileSystemURL("_doc", function(entry) {
				entry.getDirectory("tempMaker", {
					create: true,
					exclusive: false
				}, function(mdir) {
					console.log("创建tempMaker成功");
				}, function() {
					console.log("创建tempMaker失败");
				});
			}, function(e) {
				console.log(e.message + "获取doc出错");
			});
		}, function(e) {
			console.log(e.message + "删除出错");
		});
	}, function(e) {
		console.log(e.message);
	});
}

function removeAll() {
	canvas.clear();
}
//用来保存所有制作中用到的素材图片到临时文件夹
function saveTempFile(src, path, localDataPath) {
	plus.io.resolveLocalFileSystemURL(src, function(file) {
		plus.io.resolveLocalFileSystemURL("_doc/tempMaker", function(dir) {
			file.copyTo(dir, file.name, function(dirEntry) {
				console.log("New Path: " + dirEntry.fullPath);
				if (path != null && localDataPath != null) {
					console.log("保存到云");
					saveToCloud(path, localDataPath);
				}
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
function onStateChanged(upload, status) {
	if (upload.state == 4 && status == 200) {
		removeTempMaker();
	}
}

//保存到服务器时，需要将素材和canvas数据同时传到服务器上，以实现其他人改图的功能
function saveToCloud(filepath, localDataPath) {
	src = "_doc/tempMaker/";
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
				if (status == 200) {
					responData = JSON.parse(t.responseText);
					if (responData.online == "false") {
						alert("尚未登录");
					} else if (responData.upload_status == "success")
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
		//console.log("回调成功" + zipFile);
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
		var localDataPath = "data/" + second + ".txt";
		entry.getFile(localDataPath, {
			create: true
		}, function(fileEntry) {
			fileEntry.createWriter(function(writer) {
				w = writer;
				w.write(path + "\n" + data);
				writer.onwrite = function(e) {
					if (saveOption) {
						console.log("执行saveTempFile");
						saveTempFile("_doc/" + localDataPath, path, localDataPath); //保存数据到临时目录
						//这里存在服务器文件与本地文件对应的问题，
						//解决办法就是
						//将本地data路径传到服务器上保存，获取数据时查看这个路径是否存在文件
						//若存在则不下载图片，直接使用本地图片
					} else {
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
	saveTempFile(src);
	if (!arguments[1]) wid = width * 0.7;
	fabric.Image.fromURL(src, function(img) {
		console.log("打开图像 : "+src);
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
	},{
		title: "抠脸"
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
			else if (e.index == 3)
				goFaceClip();
		}
	);
}
function goFaceClip(){
	mui.openWindow({
		url: "../../module/maker/faceClip.html",
		id: "faceClip",
		styles: {
			top: 0, //新页面顶部位置
			bottom: 0 //新页面底部位置
		},
		show: {
			aniShow: "zoom-fade-out"
		}
	});
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
			//path = "../../../" + path;
			time = new Date();
			second = time.getTime();
			dst = "_doc/material/other/" + second + ".jpg";
			//将相机照片压缩并添加到素材的other文件夹中
			compressImage("_"+path, dst);
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

function testme() {
		var ctx = canvas.getContext();
		var imgData = ctx.getImageData(0, 0,width, height).data;
		var newImage = ctx.createImageData(width, height);
		var newImageData = newImage.data;
		var length = newImageData.length;
		for (var i = 0; i < length; i += 4) {
			var r = imgData[i + 0];
			var g = imgData[i + 1];
			var b = imgData[i + 2];
			var a = imgData[i + 3];
			var y = Y = 0.299 * r + 0.587 * g + 0.114 * b;
			newImageData[i + 0] = y;
			newImageData[i + 1] = y;
			newImageData[i + 2] = y;
			newImageData[i + 3] = y;
		}
		var refresh=true;
	canvas.on('after:render', function(e) {
		ctx.clearRect(0, 0, width, height);
		ctx.putImageData(newImage,0,0);
		console.log("clearRect");
		});
}

function getClipJson() {
	canvas.deactivateAll();
	canvas.renderAll();
	var ctx = canvas.getContext();
	var imgData = ctx.getImageData(0, 0, canvas.getWidth(), canvas.getHeight());
	var pixelWidth = canvas.getWidth() * 4;
	var pixelHeight = canvas.getHeight();
	var topEmpty;
	var bottomEmpty;
	var leftEmpty;
	var rightEmpty;
	for (var y = 0; y < pixelHeight; y++) { //top
		var rowEmpty = true;
		for (var x = 0; x < pixelWidth; x += 4) {
			var pixelData = new Array(
				imgData.data[x + pixelWidth * y + 0],
				imgData.data[x + pixelWidth * y + 1],
				imgData.data[x + pixelWidth * y + 2],
				imgData.data[x + pixelWidth * y + 3]
			);
			if (pixelData[3] != 0) {
				rowEmpty = false;
				break;
			}
		}
		if (!rowEmpty) {
			topEmpty = y;
			break;
		}
	}
	for (var y = pixelHeight - 1; y >= 0; y--) { //bottom
		var rowEmpty = true;
		for (var x = 0; x < pixelWidth; x += 4) {
			var pixelData = new Array(
				imgData.data[x + pixelWidth * y + 0],
				imgData.data[x + pixelWidth * y + 1],
				imgData.data[x + pixelWidth * y + 2],
				imgData.data[x + pixelWidth * y + 3]
			);
			if (pixelData[3] != 0) {
				rowEmpty = false;
				break;
			}
		}
		if (!rowEmpty) {
			bottomEmpty = y;
			break;
		}
	}
	for (var x = 0; x < pixelWidth; x += 4) { //left
		var colEmpty = true;
		for (var y = 0; y < pixelHeight; y++) {
			var pixelData = new Array(
				imgData.data[x + pixelWidth * y + 0],
				imgData.data[x + pixelWidth * y + 1],
				imgData.data[x + pixelWidth * y + 2],
				imgData.data[x + pixelWidth * y + 3]
			);
			if (pixelData[3] != 0) {
				colEmpty = false;
				break;
			}
		}
		if (!colEmpty) {
			leftEmpty = x;
			break;
		}
	}
	for (var x = pixelWidth - 4; x >= 0; x -= 4) { //right
		var colEmpty = true;
		for (var y = 0; y < pixelHeight; y++) {
			var pixelData = new Array(
				imgData.data[x + pixelWidth * y + 0],
				imgData.data[x + pixelWidth * y + 1],
				imgData.data[x + pixelWidth * y + 2],
				imgData.data[x + pixelWidth * y + 3]
			);
			if (pixelData[3] != 0) {
				colEmpty = false;
				break;
			}
		}
		if (!colEmpty) {
			rightEmpty = x;
			break;
		}
	}
	var realData = ctx.getImageData(leftEmpty / 4, topEmpty, (rightEmpty - leftEmpty) / 4, bottomEmpty - topEmpty);
	console.log(leftEmpty / 4);
	console.log(topEmpty);
	console.log((rightEmpty - leftEmpty) / 4);
	console.log(bottomEmpty - topEmpty);
	ctx.putImageData(realData, 0, 0);
	var clipJson = {
		left: leftEmpty / 4,
		top: topEmpty,
		width: (rightEmpty - leftEmpty) / 4,
		height: bottomEmpty - topEmpty
	};
	return clipJson;
}
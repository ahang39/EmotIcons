mui.plusReady(function(){
	if(plus.storage.getItem("init")==null)
	{
		initDir();
		setTimeout(function(){
			releaseResource();
		},1000);
		
	}
	else
		console.log(plus.storage.getItem("init"));
});
function initDir(){
	plus.io.resolveLocalFileSystemURL( "_doc", function ( entry ) {
		entry.getDirectory("thumbs",{create:true,exclusive:false},function(dir){
			console.log("初始化thumbs成功");
		},function(){
			console.log("初始化thumbs失败");
		});
		entry.getDirectory("picture",{create:true,exclusive:false},function(dir){
			console.log("初始化picture成功");
		},function(){
			console.log("初始化picture失败");
		});
		entry.getDirectory("resource",{create:true,exclusive:false},function(dir){
			console.log("初始化resource成功");
		},function(){
			console.log("初始化resource失败");
		});
		entry.getDirectory("data",{create:true,exclusive:false},function(dir){
			console.log("初始化data成功");
		},function(){
			console.log("初始化data失败");
		});
		entry.getDirectory("material/expression",{create:true,exclusive:false},function(dir){
			console.log("初始化expression成功");
		},function(){
			console.log("初始化expression失败");
		});
		entry.getDirectory("material/face",{create:true,exclusive:false},function(dir){
			console.log("初始化face成功");
		},function(){
			console.log("初始化face失败");
		});
		entry.getDirectory("material/other",{create:true,exclusive:false},function(dir){
			console.log("初始化other成功");
		},function(){
			console.log("初始化other失败");
		});
		entry.getDirectory("tempMaker",{create:true,exclusive:false},function(dir){
			console.log("初始化tempMaker成功");
		},function(){
			console.log("初始化tempMaker失败");
		});
		plus.storage.setItem("init","yes");
	}, function ( e ) {
	} );
}
function copyFile(src,dst){
	src.copyTo(dst,src.name,function(dir){},function(e){
	});
}
//将www目录下的程序自带资源复制到doc下
function releaseResource(){
	console.log("dsa");
	plus.io.resolveLocalFileSystemURL("_www/",function(fs){	
		fs.getDirectory("img/material/expression",{create:false},function(dir){
			var directoryReader = dir.createReader();
			directoryReader.readEntries(function(entries){
				console.log(entries.length);
				var i;
				plus.io.resolveLocalFileSystemURL("_doc/material/expression",function(dirEntry){
					for( i=0; i < entries.length; i++ ) {
						copyFile(entries[i],dirEntry);
					}
				},function(e){
					console.log(e.message);
				});
			},function(e){
				console.log(e.message);
			});
		},function(e){
			console.log(e.message);
		});
		
		
		fs.getDirectory("img/material/face",{create:false},function(dir){
			var directoryReader = dir.createReader();
			directoryReader.readEntries(function(entries){
				console.log(entries.length);
				var i;
				plus.io.resolveLocalFileSystemURL("_doc/material/face",function(dirEntry){
					for( i=0; i < entries.length; i++ ) {
						copyFile(entries[i],dirEntry);
					}
				},function(e){
					console.log(e.message);
				});
			},function(e){
				console.log(e.message);
			});
		},function(e){
			console.log(e.message);
		});
		
		fs.getDirectory("img/material/other",{create:false},function(dir){
			var directoryReader = dir.createReader();
			directoryReader.readEntries(function(entries){
				console.log(entries.length);
				var i;
				plus.io.resolveLocalFileSystemURL("_doc/material/other",function(dirEntry){
					for( i=0; i < entries.length; i++ ) {
						copyFile(entries[i],dirEntry);
					}
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

}

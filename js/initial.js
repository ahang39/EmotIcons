mui.plusReady(function(){
	if(plus.storage.getItem("init")==null)
		initDir();
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
		plus.storage.setItem("init","yes");
	}, function ( e ) {
		outLine( "Update "+item.id+" information failed: "+e.message );
	} );
}
function releaseResource(){
	
}

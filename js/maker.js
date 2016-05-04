var canvas=null;
mui.plusReady(function(){
	canvas = new fabric.Canvas('maker');
});
function paintImage(obj){
	fabric.Image.fromURL(obj.src, function(img) {
	  img.scale(1).set({
	    left: 10,
	    top: 10
	  });
	  canvas.add(img).setActiveObject(img);
	});
	canvas.item(0).set({
	    borderColor: 'red',
	    cornerColor: 'green',
	    cornerSize: 30,
	    transparentCorners: false
  });
}

function finishText(){
	var input=document.getElementById("text_input");
	var text=input.value;
	var c=document.getElementById("maker");
	var ctx=c.getContext("2d");
	ctx.font="20px Georgia";
	ctx.fillText(text,10,50);
}

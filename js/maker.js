var canvas=null;
var currentTextObj=null;//保存当前选中的文字对象
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
//	canvas.item(0).set({
//	    borderColor: 'red',
//	    cornerColor: 'green',
//	    cornerSize: 30,
//	    
//	    transparentCorners: false
//});
}

function finishText(flag){
	var input=document.getElementById("text_input");
	var text=input.value;
	var text = new fabric.Text(text, 
	{
		left: 100,
		top: 100 ,
		fontFamily: '微软雅黑',
		fontSize: 40,
		fontWeight: 'normal',
		shadow: 'green -5px -5px 3px',
		fontStyle: 'normal',
  		textBackgroundColor: 'rgb(0,200,0)'
	});
//	var text = new fabric.Text(text, 
//	{
//		left: 100,
//		top: 100 ,
//		fontFamily: 'Comic Sans',
//		fontSize: 40,
//		fontWeight: 'normal',
//		shadow: 'green -5px -5px 3px',
//		fontStyle: 'italic',
//		stroke: '#c3bfbf',
//		strokeWidth: 3,
//		textAlign: 'right',
//		lineHeight: 1,
//		textBackgroundColor: 'rgb(0,200,0)'
//	});
	text.on('selected',function(){
		document.getElementById("text_change").value=this.getText();
		currentTextObj=this;
	});
	canvas.add(text);
}

function changeText(){
	var changeText=document.getElementById("text_change").value
	currentTextObj.setText(changeText);
	canvas.renderAll();
}
function changeTextColor(obj){
	console.log(obj.style.backgroundColor);
	currentTextObj.setColor(obj.style.backgroundColor);
	canvas.renderAll();
}
function changeTextBackgroundColor(obj){
	console.log(obj.style.backgroundColor);
	currentTextObj.setTextBackgroundColor(obj.style.backgroundColor);
	canvas.renderAll();
}
function changeTextShadowColor(obj){
	console.log(obj.style.backgroundColor);
	currentTextObj.setTextBackgroundColor(obj.style.backgroundColor);
	canvas.renderAll();
}
function changeTextFontFamily(obj){
	console.log(obj.style.fontFamily);
	currentTextObj.setFontFamily(obj.style.fontFamily);
	canvas.renderAll();
}

function paintImage(obj){
	var c=document.getElementById("maker");
	var ctx=c.getContext("2d");
	ctx.drawImage(obj,10,10);
}

function finishText(){
	var input=document.getElementById("text_input");
	var text=input.value;
	var c=document.getElementById("maker");
	var ctx=c.getContext("2d");
	ctx.font="20px Georgia";
	ctx.fillText(text,10,50);
}

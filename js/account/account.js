function setProfile(data){
	if(data.id!=null){
		plus.storage.setItem("id",data.id);
		plus.storage.setItem("username",data.username);
	    plus.storage.setItem("email",data.email);
	    plus.storage.setItem("phone_number",data.phone_number);
	    plus.storage.setItem("register_time",data.register_time);
	    plus.storage.setItem("type",data.type);
	    plus.storage.setItem("token",data.token)
	}
}
function removeProfile(){
	plus.storage.removeItem("id");
	plus.storage.removeItem("username");
	plus.storage.removeItem("email");
	plus.storage.removeItem("phone_number");
	plus.storage.removeItem("register_time");
	plus.storage.removeItem("type");
	plus.storage.removeItem("token");
}
function getUserId(){
	if(plus.storage.getItem("id")!=null)
    	return plus.storage.getItem("id");
    else
    	return "未登录";
}
function getUsername(){
	if(plus.storage.getItem("username")!=null)
    	return plus.storage.getItem("username");
    else
    	return "未设置用户名";
}
function getEmail(){
	if(plus.storage.getItem("email")!=null)
		return plus.storage.getItem("email");
	else
		return "未绑定邮箱";
}
function setUsername(username){
	var postData=JSON.parse('{"action":"account_action","sub_action":"setProfile","profileType":"username","profileValue":"'+username+'"}');
	console.log(postData);
	mui.ajax("http://tu.myway5.com/php/index.php",{
    		data:postData,
            dataType:"json",
            type:"POST",
            timeout:10000,
            success:function(respon,status,xhr){
                if(respon.update=="successful"){
                    mui.alert("修改用户名成功!","提示信息","确认",function(){
                    	plus.storage.setItem("username",username);
                    	mui.openWindow("profile.html");
                    });
                }else{
                    mui.alert("注册失败!","提示信息","确认",null);
                }
                
            },
            error:function(xhr,type,errorThrown){
            	mui.alert("服务器响应出错!错误类型:"+type,"提示信息","确认",null);
            }
        });
}

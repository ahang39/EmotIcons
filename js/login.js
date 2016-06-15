//包含用户的登录，注册以及退出动作
function account_gate(url,data,flag){
    switch(flag){
        case "account_login":
            account_login(url,data);
            break;
        case "exit_login":
            exit_login(url,data);
            break;
        case "isonline":
            isonline(url,data);
            break;
        case "account_register":
            account_register(url,data);
            break;
        default:
            console.log("default");
            break;
    }
}
/**********账户注册*********/
function account_register(surl,send){
    mui.ajax(surl,{
    		data:send,
            dataType:"json",
            type:"POST",
            timeout:10000,
            success:function(respon,status,xhr){
                if(respon.register_status=="successful"){
                    mui.alert("注册成功!","提示信息","确认",function(){
                    	mui.openWindow("login.html");
                    });
                }else{
                    mui.alert("注册失败!","提示信息","确认",null);
                }
                
            },
            error:function(){
            	mui.alert("服务器响应出错!","提示信息","确认",null);
            }
           });
}
/**********账户登录*********/
function account_login(surl,send){
	for(var key in send){
		console.log(send[key]);
	}
    mui.ajax(surl,{
    		data:send,
            dataType:"json",
            type:"POST",
            timeout:10000,
            success:function(respon,status,xhr){
                if(respon.login_status=="successful"){
                    mui.alert("登录成功!","提示信息","确认",function(){
                    	plus.storage.setItem("email",send.email);
                    	plus.storage.setItem("password",send.password);
                    	setProfile(respon);
                    	mui.openWindow("profile.html");
                    });
                }else{
                	mui.alert("登录失败!","提示信息","确认",null);
                }
                
            },
            error:function(){
                mui.alert("服务器响应出错!","提示信息","确认",null);
            }
           });
}
/***********************检查用户的cookie是否存在*******************/
function isonline(surl,send){
    mui.ajax(surl,{
            dataType:"json",
            data:send,
            type:"POST",
            success:function(respon,status,xhr){
                if(respon.online=="true"){
                    
                }else{
                    
                }
                
            },
            error:function(){
                mui.alert("服务器响应出错!","提示信息","确认",null);
            }
           });
}
/**********************退出登录**********************/
function exit_login(surl,send){
    mui.ajax(surl,{
            dataType:"json",
            data:send,
            type:"POST",
            success:function(respon,status,xhr){
                if(respon.exit_status=="successful"){
                	removeProfile();
                    mui.alert("退出登录成功!","提示信息","确认",null);
                }else{
                	mui.alert("退出登录失败!","提示信息","确认",null);
                }
                
            },
            error:function(){
                mui.alert("服务器响应出错!","提示信息","确认",null);
            }
           });
}
mui.plusReady(function(){
	mui("#login_button").on("tap","#login",function(){
		account_gate("http://tu.myway5.com/php/index.php",{"action":"account_action","sub_action":"login","email":document.forms["login_form"]["email"].value,"password":document.forms["login_form"]["password"].value},"account_login")
	});
	mui("#register_button").on("tap","#register",function(){
		account_gate("http://tu.myway5.com/php/index.php",{"action":"account_action","sub_action":"register","username":document.forms["register_form"]["username"].value,"password":document.forms["register_form"]["password"].value,"email":document.forms["register_form"]["email"].value},"account_register");
	});
	mui("#exit_panel").on("tap","#exit_button",function(){
		account_gate("http://tu.myway5.com/php/index.php",{"action":"account_action","sub_action":"exit_login"},"exit_login");
	});
});


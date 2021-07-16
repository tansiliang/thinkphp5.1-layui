layui.define(['element','form','layer','http'],function(exports){

    var $ = layui.$, form = layui.form,layer = layui.layer,http = layui.http;
    $('.input-field').on('change',function(){
        var $this = $(this),
            value = $.trim($this.val()),
            $parent = $this.parent();

        if(value !== '' && !$parent.hasClass('field-focus')){
            $parent.addClass('field-focus');
        }else{
            $parent.removeClass('field-focus'); 
        }
    })

    /**
     * 登录
     */
    form.on('submit(logininfo)',function(data){
        // console.log(http)
        // console.log(data)
        var paramsinfo = data.field;//获取表单数据
        if(paramsinfo.username == ''){
            layer.msg('请输入用户名');
            return false;
        }
        if(paramsinfo.password == ''){
            layer.msg('请输入登录密码');
            return false;
        }
        $.ajax({
            url:http.api + 'admin_login',
            type:'POST',
            datatype:"json",
            data:paramsinfo,
            async: true,
            success:function(res){
                console.log(res);
                if(res.code == 200){
                    localStorage.setItem("userinfo",JSON.stringify(res.data));
                    window.location.href = '/index.html';
                }else{
                    layer.msg(res.msg);
                    return false;
                }
            }
        })
        return false;
    })


    exports('login');
});
layui.define(['element','layer','http','tab'],function(exports){

    var $ = layui.$, $body = $('body'),
        element = layui.element,tabinfo = layui.tab,
        layer = layui.layer,http = layui.http;
    
    //获取用户信息
    var userinfo = localStorage.getItem('userinfo');
    if(userinfo){
        userinfo = JSON.parse(userinfo);
        $("#username").text(userinfo.user_login);
    }else {
        layer.msg('未登录，请先登录');
        window.location.href = '/login.html';
    }
    console.log(userinfo)
    console.log('用户信息')

    /**
     * 获取菜单列表
     * @param {*} u_id 
     */
    var getmenu_list = function(u_id){
        $.ajax({
            url:http.api + 'menu_list',
            type:'GET',
            datatype:'json',
            headers:{
                // 'token':userinfo.access_token
            },
            data:{
                u_id:u_id,
                access_token:userinfo.access_token
            },
            async: true,
            success:function(res){
                console.log(res)
                if(res.code == 200){
                    // <li class="layui-nav-item">
                    //     <a href="javascript:;">
                    //         <i class="layui-icon">&#xe857;</i>
                    //         <em>组件</em>
                    //     </a>
                    //     <dl class="layui-nav-child">
                    //         <dd><a href="views/form.html">表单</a></dd>
                    //         <dd>
                    //             <a href="javascript:;">页面</a>
                    //             <dl class="layui-nav-child">
                    //                 <dd>
                    //                     <a href="login.html">登录页</a>
                    //                 </dd>
                    //             </dl>
                    //         </dd>
                    //     </dl>
                    // </li>
                    var html = '';
                    var datainfo = res.data;
                    for(var i in datainfo){
                        html += '<li class="layui-nav-item"><a href="'+datainfo[i].jump+'"><i class="layui-icon">'+datainfo[i].icon+'</i><em>'+datainfo[i].title+'</em></a>';
                        var datainfotwo = datainfo[i]['list'];//二级菜单
                        if(datainfotwo.length != 0){
                            html += '<dl class="layui-nav-child">';
                        }
                        for(var j in datainfotwo){
                            html += '<dd><a href="'+datainfotwo[j].jump+'">'+datainfotwo[j].title+'</a>';
                            var datainfothree = datainfotwo[j]['list'];
                            if(datainfothree.length != 0){
                                html += '<dl class="layui-nav-child">';
                            }
                            for(var z in datainfothree){
                                html += '<dd><a href="'+datainfothree[z].jump+'">'+datainfothree[z].title+'</a></dd>';
                            }
                            if(datainfothree.length != 0){
                                html += '</dl>';
                            }
                            html += '</dd>';
                        }
                        if(datainfotwo.length != 0){
                            html += '</dl>';
                        }
                    }
                    $("#Nav").append(html);
                    element.init();
                    new Home();//初始化整个导航的事件
                }else if(res.code == 100){
                    layer.msg(res.msg);
                    window.location.href = '/login.html';
                }else{
                    layer.msg(res.msg);
                    return false
                }
            }
        })
    }
    getmenu_list(userinfo.id);//加载导航

    /**
     * 退出登录
     */
    $("#getout").on('click',function(){
        $.ajax({
            url:http.api + 'menu_list',
            type:'GET',
            datatype:'json',
            data:{
                u_id:userinfo.id,
                access_token:userinfo.access_token
            },
            async: true,
            success:function(res){
                console.log(res)
                if(res.code == 200){
                    window.location.href = '/login.html';
                }else if(res.code == 100){
                    layer.msg(res.msg);
                    window.location.href = '/login.html';
                }else{
                    layer.msg(res.msg);
                    return false
                }
            }
        })
    })










    //菜单操作方法
    var screen_size = {
        pc : [991, -1],
        pad : [768, 990],
        mobile : [0, 767]
    }

    var getDevice = function(){
        var width = $(window).width();
        for (var i in screen_size) {
            var sizes = screen_size[i],
                min = sizes[0],
                max = sizes[1];
            if(max == -1) max = width;
            if(min <= width && max >= width){
                return i;
            }
        }
        return null;
    }

    var isDevice = function(label){
        return getDevice() == label;
    }

    var isMobile = function(){
        return isDevice('mobile');
    }

    

    var Home = function(){

        // var tabs = new Tab('tabs'),
        console.log(tabinfo)
        var tabs = tabinfo.tab('tabs'),
         navItems = [];
        $('#Nav a').on('click',function(event){
            event.preventDefault();
            var $this = $(this), url = $this.attr('href'),
                title = $.trim($this.text());
            if( url && url!=='javascript:;' ){
                if(tabs.is(url)){
                    tabs.change(url);
                } else {
                    navItems.push($this);
                    tabs.add(title, url);
                }
            }
            $this.closest('li.layui-nav-item')
                .addClass('layui-nav-itemed')
                .siblings()
                .removeClass('layui-nav-itemed');
        });

        // 默认触发第一个子菜单的点击事件
        $('#Nav li.layui-nav-item:eq(0) > dl.layui-nav-child > dd > a:eq(0)').trigger('click');

        tabs.onChange(function(data){
            var i = data.index, $this = navItems[i];
            if($this && typeof $this === 'object') {
                $('#Nav dd').removeClass('layui-this');
                $this.parent('dd').addClass('layui-this');
                $this.closest('li.layui-nav-item')
                    .addClass('layui-nav-itemed')
                    .siblings()
                    .removeClass('layui-nav-itemed');
            }
        });

        tabs.onDelete(function(data){
            var i = data.index;
            navItems.splice(i,1);
        });

        this.slideSideBar();
    }

    Home.prototype.slideSideBar = function() {
        var $slideSidebar = $('.slide-sidebar'),
            $pageContainer = $('.layui-body'),
            $mobileMask = $('.mobile-mask');

        var isFold = false;
        $slideSidebar.click(function(e){
            e.preventDefault();
            var $this = $(this), $icon = $this.find('i'),
                $admin = $body.find('.layui-layout-admin');
            var toggleClass = isMobile() ? 'fold-side-bar-xs' : 'fold-side-bar';
            if($icon.hasClass('ai-menufold')){
                $icon.removeClass('ai-menufold').addClass('ai-menuunfold');
                $admin.addClass(toggleClass);
                isFold = true;
                if(isMobile()) $mobileMask.show();
            }else{
                $icon.removeClass('ai-menuunfold').addClass('ai-menufold');
                $admin.removeClass(toggleClass);
                isFold = false;
                if(isMobile()) $mobileMask.hide();
            }
        });

        var tipIndex;
        // 菜单收起后的模块信息小提示
        $('#Nav li > a').hover(function(){
            var $this = $(this);
            if(isFold) {
                tipIndex = layer.tips($this.find('em').text(),$this);
            }
        }, function(){
            if(isFold && tipIndex ){
                layer.close(tipIndex);
                tipIndex = null
            }
        })

        if(isMobile()){
            $mobileMask.click(function(){
                $slideSidebar.trigger('click');
            });
        }
    }

    exports('home',{});
});
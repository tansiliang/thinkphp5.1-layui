layui.define(['element', 'layer', 'http', 'table', 'form', "tree", "util"], function (exports) {

    var $ = layui.$, tree = layui.tree, util = layui.util,
        layer = layui.layer, http = layui.http, form = layui.form;
    //展示已知数据
    var userinfo = localStorage.getItem('userinfo');
    if (userinfo) {
        userinfo = JSON.parse(userinfo);
        $("#username").text(userinfo.user_login);
    } else {
        layer.msg('未登录，请先登录');
        window.location.href = '/login.html';
    }
    /**
     * 获取参数值
     * @param {*} name 参数名
     * @returns 
     */
    var getparam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        } else {
            return 0;
        }
    };

    let typeinfo = getparam('type');
    let idinfo = getparam('id');

    /**
     * 关闭弹窗，返回上一页
     */
    $("#returnclosepage").on('click', function () {
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        parent.layer.close(index); //再执行关闭 
    })

    /**
     * 管理员添加页面
     */
    var getuserlistadd = function(){
        $.ajax({
            url: http.api + 'role_list',
            type: 'get',
            datatype: 'json',
            data: {
                'access_token': userinfo.access_token
            },
            async: true,
            success: function (res) {
                console.log('角色列表')
                console.log(res)
                var data = res.data
                if (res.code == 200) {
                    var html = '';
                    // layer.closeAll('iframe');
                    // var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    // parent.layer.close(index); //再执行关闭 
                    // layer.msg(res.msg);
                    
                    for(var i in data){
                        if(data[i]['role_id'] == 1){
                            var displeinf = 'disabled';
                        }else{
                            var displeinf = '';
                        }
                        html += '<input type="radio" name="user_sign" lay-verify="required" value="'+data[i]['role_id']+'" '+displeinf+' title="'+data[i]["role_name"]+'" >';
                    }
                    $("#roleinfo").append(html);
                    form.render();
                } else if (res.code == 100) {
                    layer.msg(res.msg);
                    window.location.href = '/login.html';
                } else {
                    layer.msg(res.msg);
                    return false
                }

            }
        })
    }

    /**
     * 管理员编辑页面数据
     * @param {*} id 管理员ID
     */
    var getuserlisedit = function(id){
        $.ajax({
            url: http.api + 'administrators_edit',
            type: 'get',
            datatype: 'json',
            data: {
                'id':id,
                'access_token': userinfo.access_token
            },
            async: true,
            success: function (res) {
                console.log('管理员信息')
                console.log(res)
                var data = res.data
                if (res.code == 200) {
                    form.val("usereditdata",{
                        'user_login':data.user_login,
                        'user_nickname':data.user_nickname,
                        'user_mobile':data.user_mobile,
                        'user_status':data.user_status,
                        'user_sign':data.user_sign,
                        'id':data.id
                    });
                    form.render();
                } else if (res.code == 100) {
                    layer.msg(res.msg);
                    window.location.href = '/login.html';
                } else {
                    layer.msg(res.msg);
                    return false
                }

            }
        })
    }

    /**
     * 管理员添加方法
     * 
     */
    form.on("submit(useraddform)", function (event) {
        console.log(event)
        var fieldata = event.field;//获取form中的数据
        console.log('添加菜单')
        console.log(fieldata);
        fieldata['access_token'] = userinfo.access_token;
        if(!fieldata.user_sign){
            layer.msg('请选择管理员角色');
            return false;
        }
        $.ajax({
            url: http.api + 'administrators_add',
            type: 'POST',
            datatype: 'json',
            data: fieldata,
            async: true,
            success: function (res) {
                console.log(res)
                if (res.code == 200) {
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭 
                    layer.msg(res.msg);
                } else if (res.code == 100) {
                    layer.msg(res.msg);
                    window.location.href = '/login.html';
                } else {
                    layer.msg(res.msg);
                    return false
                }
            }
        })
        return false;
    });

    /**
     * 保存修改管理员的信息
     */
    form.on("submit(usereditform)",function(event){
        var fieldata = event.field;//获取form中的数据
        fieldata['access_token'] = userinfo.access_token;
        console.log(fieldata)
        if(fieldata['pass'] != fieldata['user_pass']){
            layer.msg('两次密码不一致，请重新输入!');
            return false;
        }
        $.ajax({
            url: http.api + 'administrators_editpost',
            type: 'POST',
            datatype: 'json',
            data: fieldata,
            async: true,
            success: function (res) {
                console.log(res)
                if (res.code == 200) {
                    // layer.closeAll('iframe');
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭 
                    layer.msg(res.msg);
                } else if (res.code == 100) {
                    layer.msg(res.msg);
                    window.location.href = '/login.html';
                } else {
                    layer.msg(res.msg);
                    return false
                }
            }
        })
        return false;
    })

    /**
     * 添加角色信息方法
     */
    form.on("submit(roleaddform)", function (event) {
        console.log(event);
        var fieldata = event.field;//获取form中的数据
        fieldata['access_token'] = userinfo.access_token;
        console.log(fieldata)
        $.ajax({
            url: http.api + 'role_addpost',
            type: 'POST',
            datatype: 'json',
            data: fieldata,
            async: true,
            success: function (res) {
                console.log(res)
                if (res.code == 200) {
                    // layer.closeAll('iframe');
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭 
                    layer.msg(res.msg);
                } else if (res.code == 100) {
                    layer.msg(res.msg);
                    window.location.href = '/login.html';
                } else {
                    layer.msg(res.msg);
                    return false
                }
            }
        })
        return false;
    })

    /**
     * 保存角色数据
     */
    form.on("submit(roleeditform)", function (event) {
        var fieldata = event.field;//获取form中的数据
        fieldata['access_token'] = userinfo.access_token;
        $.ajax({
            url: http.api + 'role_editpost',
            type: 'POST',
            datatype: 'json',
            data: fieldata,
            async: true,
            success: function (res) {
                console.log(res)
                if (res.code == 200) {
                    // layer.closeAll('iframe');
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭 
                    layer.msg(res.msg);
                } else if (res.code == 100) {
                    layer.msg(res.msg);
                    window.location.href = '/login.html';
                } else {
                    layer.msg(res.msg);
                    return false
                }
            }
        })
        return false;
    })

    /**
     * 获取分配权限数据
     * @param {*} id 
     */
    var gettreedata = function (id) {
        $.ajax({
            url: http.api + 'menuinfo_rbct',
            type: 'get',
            datatype: 'json',
            data: {
                r_id: id,
                'access_token': userinfo.access_token
            },
            async: true,
            success: function (res) {
                console.log('分配权限')
                console.log(res)
                var data = res.data
                /**
                 * 权限分配
                 */
                tree.render({
                    elem: '#assignper'
                    , data: data
                    , showCheckbox: true  //是否显示复选框
                    , id: 'demoId1'
                    , isJump: false //是否允许点击节点时弹出新窗口跳转
                    , click: function (obj) {
                        var data = obj.data;  //获取当前点击的节点数据
                        layer.msg('状态：' + obj.state + '<br>节点数据：' + JSON.stringify(data));
                    }
                });

            }
        })
    }

    /**
     * 获取选中的数据-保存分配权限数据
     */
    util.event('lay-demo', {
        getChecked: function (othis) {
            var checkedData = tree.getChecked('demoId1'); //获取选中节点的数据
            if(checkedData.length == 0){
                layer.msg('请先选择对应的菜单')
            }
            var ids = [];
            for(var i in checkedData){
                var towchildren = checkedData[i]['children'];
                for(var j in towchildren){
                    var threechildren = towchildren[j]['children'];
                    ids.push(towchildren[j]['id']);
                    for(var z in threechildren){
                        ids.push(threechildren[z]['id']);
                    }
                }
                ids.push(checkedData[i]['id']);
            }
            // layer.alert(JSON.stringify(checkedData), { shade: 0 });
            // console.log(checkedData);
            // console.log(ids);
            $.ajax({
                url: http.api + 'menuinfo_rbctpost',
                type: 'POST',
                datatype: 'json',
                data: {
                    'r_id': idinfo,
                    'ids':ids.join(','),
                    'access_token': userinfo.access_token
                },
                async: true,
                success: function (res) {
                    console.log(res)
                    if (res.code == 200) {
                        // layer.closeAll('iframe');
                        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                        parent.layer.close(index); //再执行关闭 
                        layer.msg(res.msg);
                    } else if (res.code == 100) {
                        layer.msg(res.msg);
                        window.location.href = '/login.html';
                    } else {
                        layer.msg(res.msg);
                        return false
                    }
                }
            })
        }
        // , setChecked: function () {
        //     //   tree.setChecked('demoId1', [12, 16]); //勾选指定节点
        // }
        // , reload: function () {
        //     //重载实例
        //     tree.reload('demoId1', {

        //     });

        // }
    });

    /**
     * 上级菜单数据
     */
    var getmenulistadd = function(){
        $.ajax({
            url: http.api + 'menuinfo_add',
            type: 'get',
            datatype: 'json',
            data: {
                'access_token': userinfo.access_token
            },
            async: true,
            success: function (res) {
                console.log('上级菜单列表')
                console.log(res)
                var data = res.data
                if (res.code == 200) {
                    var html = '';
                    for(var i in data){
                        html += '<option value="'+data[i].id+'">'+data[i].title+'</option>';
                    }
                    $("#pidinfo").append(html);
                    form.render();
                } else if (res.code == 100) {
                    layer.msg(res.msg);
                    window.location.href = '/login.html';
                } else {
                    layer.msg(res.msg);
                    return false
                }

            }
        })
    }

    /**
     * 保存添加菜单数据
     */
     form.on("submit(menuaddform)", function (event) {
        var fieldata = event.field;//获取form中的数据
        fieldata['access_token'] = userinfo.access_token;
        $.ajax({
            url: http.api + 'menuinfo_addpost',
            type: 'POST',
            datatype: 'json',
            data: fieldata,
            async: true,
            success: function (res) {
                console.log(res)
                if (res.code == 200) {
                    // layer.closeAll('iframe');
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭 
                    layer.msg(res.msg);
                } else if (res.code == 100) {
                    layer.msg(res.msg);
                    window.location.href = '/login.html';
                } else {
                    layer.msg(res.msg);
                    return false
                }
            }
        })
        return false;
    })

    /**
     * 编辑菜单数据
     */
    var getmenulisedit = function(id){
        $.ajax({
            url: http.api + 'menuinfo_edit',
            type: 'get',
            datatype: 'json',
            data: {
                'id':id,
                'access_token': userinfo.access_token
            },
            async: true,
            success: function (res) {
                console.log('菜单信息')
                console.log(res)
                var data = res.data
                if (res.code == 200) {
                    form.val("menueditdata",{
                        'title':data.title,
                        'jump':data.jump,
                        'icon':data.icon,
                        'starts':data.starts,
                        'p_id':data.p_id,
                        'id':data.id
                    });
                    form.render();
                } else if (res.code == 100) {
                    layer.msg(res.msg);
                    window.location.href = '/login.html';
                } else {
                    layer.msg(res.msg);
                    return false
                }

            }
        })
    }

    /**
     * 保存编辑菜单数据
     */
     form.on("submit(menueditform)", function (event) {
        var fieldata = event.field;//获取form中的数据
        fieldata['access_token'] = userinfo.access_token;
        $.ajax({
            url: http.api + 'menuinfo_editpost',
            type: 'POST',
            datatype: 'json',
            data: fieldata,
            async: true,
            success: function (res) {
                console.log(res)
                if (res.code == 200) {
                    // layer.closeAll('iframe');
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭 
                    layer.msg(res.msg);
                } else if (res.code == 100) {
                    layer.msg(res.msg);
                    window.location.href = '/login.html';
                } else {
                    layer.msg(res.msg);
                    return false
                }
            }
        })
        return false;
    })

    /**
     * 获取参数值
     */
    var names = getparam('names');
    if (typeinfo = 2) {
        if(names == 'assignpermission'){
            //权限分配
            gettreedata(idinfo);
        }else if(names == 'userlistadd'){
            //添加管理员页面
            getuserlistadd();
            if(idinfo != 0 ){
                setTimeout(() => {
                    getuserlisedit(idinfo)
                }, 200);
            }
        }else if(names == 'menuadd'){
            getmenulistadd();
            if(idinfo != 0){
                setTimeout(() => {
                    getmenulisedit(idinfo)
                }, 200);
            }
        }
    }else{
        
    }

    exports('threesetinfo');
});
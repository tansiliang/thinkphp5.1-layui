layui.define(['element', 'layer', 'http', 'table', 'form', 'tree', 'util'], function (exports) {

    var $ = layui.$, element = layui.element, tree = layui.tree, util = layui.util,
        layer = layui.layer, http = layui.http, table = layui.table, form = layui.form;
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
     * 管理员列表
     */
    var userlistfun = function(){
        table.render({
            elem: '#userlist'
            // ,toolbar:'#userlist-barDemo'
            , url: http.api + 'adminuserlist'
            , title: '管理员列表'
            , method: 'GET'
            , where: {
                'access_token': userinfo.access_token
            }//参数
            , cols: [[ //标题栏
                { field: 'id', title: 'ID', sort: true }
                , { field: 'user_login', title: '用户名' }
                , { field: 'user_nickname', title: '用户呢称' }
                , { field: 'last_ip', title: '最后登录IP地址' }
                , { field: 'user_logintime', title: '最后登录时间', minWidth: 160 }
                , { field: 'user_status', title: '状态' }
                , { fixed: 'right', title: '操作', toolbar: '#userlist-barDemo', width: 150 }
            ]]
            , response: {
                // statusName: 'ReturnType', //数据状态的字段名称，默认：code
                statusCode: 200,//成功的状态码，默认：0
                // msgName: 'ReturnMsg', //状态信息的字段名称，默认：msg
                countName: 'total', //数据总数的字段名称，默认：count
                // dataName: 'ReturnData', //数据列表的字段名称，默认：data
            }
            , parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
                console.log(res)
                var resdata = res.data;
                return {
                    "code": res.code, //解析接口状态
                    "msg": res.msg, //解析提示文本
                    "total": res.total, //解析数据长度
                    "data": resdata //解析数据列表
                };
            }
            // ,data: []
            , skin: 'line' //表格风格
            , even: true
            , page: true //是否显示分页
            , limits: [10, 20, 30]
            , limit: 10 //每页默认显示的数量
        });
    }
    userlistfun();

    /**
     * 监听行工具事件，监听管理员列表数据
     */
    table.on('tool(userlist)', function (obj) {
        console.log(obj);
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('真的删除么?', function (index) {

                $.ajax({
                    url: http.api + '',
                    type: 'get',
                    data: {
                        id: data.id,
                        'access_token': userinfo.access_token
                    },
                    success: function (res) {
                        console.log(res)
                        console.log('删除')
                        var resdata = res.data;
                        if (res.code == 200) {
                            //保存成功
                            layer.msg("删除成功");

                            obj.del();
                            layer.close(index);
                        } else {
                            //获取失败
                            layer.msg(res.msg);
                        }
                    }
                })
            });
        } else if (obj.event === 'edit') {
            // 编辑
            layer.open({
                type: 2,
                title: '添加管理员页面',
                shadeClose: true,
                shade: false,
                maxmin: false, //开启最大化最小化按钮
                area: ['893px', '600px'],
                content: '/views/setup/useredit.html?names=userlistadd&type=2&id='+data.id,
                skin: 'addinfoclass',
                end:function(){
                    userlistfun()
                }
            })
        }
    });

    /**
     * 添加管理员页面
     */
    $("#addinfo").on("click", function () {
        layer.open({
            type: 2,
            title: '添加管理员页面',
            shadeClose: true,
            shade: false,
            maxmin: false, //开启最大化最小化按钮
            area: ['893px', '600px'],
            content: '/views/setup/useradd.html?names=userlistadd&type=2',
            skin: 'addinfoclass',
            end:function(){
                userlistfun()
            }
        })
    })

    /**
     * 角色列表
     */
    var relolistfun = function () {
        table.render({
            elem: '#rolelist'
            , url: http.api + 'role_list'
            , title: '角色列表'
            , method: 'GET'
            , where: {
                'access_token': userinfo.access_token
            }//参数
            , cols: [[ //标题栏
                { field: 'role_id', title: 'ID', sort: true }
                , { field: 'role_name', title: '角色名称' }
                , { field: 'role_dec', title: '角色描述' }
                , { field: 'user_status', title: '状态' }
                , { field: 'create_time', title: '创建时间' }
                , { fixed: 'right', title: '操作', toolbar: '#rolelist-barDemo', width: 200 }
            ]]
            , response: {
                // statusName: 'ReturnType', //数据状态的字段名称，默认：code
                statusCode: 200,//成功的状态码，默认：0
                // msgName: 'ReturnMsg', //状态信息的字段名称，默认：msg
                countName: 'total', //数据总数的字段名称，默认：count
                // dataName: 'ReturnData', //数据列表的字段名称，默认：data
            }
            , parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
                console.log(res)
                var resdata = res.data;
                return {
                    "code": res.code, //解析接口状态
                    "msg": res.msg, //解析提示文本
                    "total": res.total, //解析数据长度
                    "data": resdata //解析数据列表
                };
            }
            // ,data: []
            , skin: 'line' //表格风格
            , even: true
            , page: true //是否显示分页
            , limits: [10, 20, 30]
            , limit: 10 //每页默认显示的数量
        });
    }
    relolistfun();

    /**
     * 监听行工具事件，监听角色列表数据
     */
    table.on('tool(rolelist)', function (obj) {
        console.log(obj);
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('真的删除么?', function (index) {
                $.ajax({
                    url: http.api + 'role_delete',
                    type: 'POST',
                    data: {
                        id: data.role_id
                    },
                    success: function (res) {
                        console.log(res)
                        console.log('删除')
                        var resdata = res.data;
                        if (res.code == 200) {
                            //保存成功
                            layer.msg("删除成功");

                            obj.del();
                            layer.close(index);
                        } else {
                            //获取失败
                            layer.msg(res.msg);
                        }
                    }
                })
            });
        } else if (obj.event === 'edit') {
            // 编辑
            layer.open({
                type: 2,
                title: '编辑角色页面',
                shadeClose: true,
                shade: false,
                maxmin: false, //开启最大化最小化按钮
                area: ['893px', '600px'],
                content: '/views/setup/role_edit.html',
                skin: 'addinfoclass',
                end: function () {
                    // 关闭页面时，刷新数据
                    // relolistfun();
                },
                success: function (dom) {
                    // console.log(data)
                    //给子页面赋值
                    var a = $(dom[0]).find("iframe").eq(0).contents();
                    a.find("#role_name").val(data.role_name);
                    a.find("#role_dec").val(data.role_dec);
                    if (data.role_status == 0) {
                        //禁用
                        a.find("#status1").removeAttr('checked');
                        a.find("#status0").attr('checked', true);
                    } else {
                        a.find("#status0").removeAttr('checked');
                        a.find("#status1").attr('checked', true);
                    }
                    a.find("#id").val(data.role_id);

                    // form.val('roleeditform',{
                    //     'id' : data.role_id,
                    //     'role_status' : data.role_status,
                    //     'role_dec' : data.role_dec,
                    //     'role_name' : data.role_name
                    // }) 
                }
            })
        } else if (obj.event === 'jurisdiction') {
            //权限分配
            layer.open({
                type: 2,
                title: '编辑角色页面',
                shadeClose: true,
                shade: false,
                maxmin: false, //开启最大化最小化按钮
                area: ['893px', '600px'],
                content: '/views/setup/assignpermissions.html?names=assignpermission&type=2&id='+data.role_id,
                skin: 'addinfoclass',
                end: function () {
                    // 关闭页面时，刷新数据
                    // relolistfun();
                },
                success: function (dom) {
                    // console.log(data)
                    //给子页面赋值
                    // var a = $(dom[0]).find("iframe").eq(0).contents();
                    // a.find("#role_name").val(data.role_name);
                    // a.find("#role_dec").val(data.role_dec);
                    // if (data.role_status == 0) {
                    //     //禁用
                    //     a.find("#status1").removeAttr('checked');
                    //     a.find("#status0").attr('checked', true);
                    // } else {
                    //     a.find("#status0").removeAttr('checked');
                    //     a.find("#status1").attr('checked', true);
                    // }
                    // a.find("#id").val(data.role_id);

                    // form.val('roleeditform',{
                    //     'id' : data.role_id,
                    //     'role_status' : data.role_status,
                    //     'role_dec' : data.role_dec,
                    //     'role_name' : data.role_name
                    // }) 
                }
            })
        }
    });

    /**
     * 添加角色
     */
    $("#roleaddpage").on("click", function () {
        layer.open({
            type: 2,
            title: '添加角色页面',
            shadeClose: true,
            shade: false,
            maxmin: false, //开启最大化最小化按钮
            area: ['893px', '600px'],
            content: '/views/setup/role_add.html',
            skin: 'addinfoclass',
            end: function () {
                // 关闭页面时，刷新数据
                relolistfun();
            }
        })
    })

    /**
     * 菜单列表
     */
    var getmenulist = function(){
        table.render({
            elem: '#menulist'
            , url: http.api + 'menuinfo_list'
            , title: '菜单列表'
            , method: 'GET'
            , where: {
                'access_token': userinfo.access_token
            }//参数
            , cols: [[ //标题栏
                { field: 'id', title: 'ID', sort: true }
                , { field: 'title', title: '菜单名称' }
                , { field: 'jump', title: '路径' }
                , { field: 'starts', title: '状态' }
                , { field: 'createtime', title: '创建时间' }
                , { fixed: 'right', title: '操作', toolbar: '#menulist-barDemo', width: 200 }
            ]]
            , response: {
                // statusName: 'ReturnType', //数据状态的字段名称，默认：code
                statusCode: 200,//成功的状态码，默认：0
                // msgName: 'ReturnMsg', //状态信息的字段名称，默认：msg
                countName: 'total', //数据总数的字段名称，默认：count
                // dataName: 'ReturnData', //数据列表的字段名称，默认：data
            }
            , parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
                console.log(res)
                var resdata = res.data;
                return {
                    "code": res.code, //解析接口状态
                    "msg": res.msg, //解析提示文本
                    "total": res.total, //解析数据长度
                    "data": resdata //解析数据列表
                };
            }
            // ,data: []
            , skin: 'line' //表格风格
            , even: true
            , page: true //是否显示分页
            , limits: [10, 20, 30]
            , limit: 10 //每页默认显示的数量
        });
    }
    getmenulist();

    /**
     * 监听行工具事件，监听角色列表数据
     */
     table.on('tool(menulist)', function (obj) {
        console.log(obj);
        var data = obj.data;
        if (obj.event === 'del') {
            layer.confirm('真的删除么?', function (index) {
                $.ajax({
                    url: http.api + 'menuinfo_delete',
                    type: 'POST',
                    data: {
                        id: data.id,
                        'access_token': userinfo.access_token
                    },
                    success: function (res) {
                        console.log(res)
                        console.log('删除')
                        var resdata = res.data;
                        if (res.code == 200) {
                            //保存成功
                            layer.msg("删除成功");

                            obj.del();
                            layer.close(index);
                        } else {
                            //获取失败
                            layer.msg(res.msg);
                        }
                    }
                })
            });
        } else if (obj.event === 'edit') {
            // 编辑
            layer.open({
                type: 2,
                title: '编辑角色页面',
                shadeClose: true,
                shade: false,
                maxmin: false, //开启最大化最小化按钮
                area: ['893px', '600px'],
                content: '/views/setup/menu_edit.html?names=menuadd&type=2&id='+data.id,
                skin: 'addinfoclass',
                end: function () {
                    // 关闭页面时，刷新数据
                    getmenulist();
                },
                success: function (dom) {
                    
                }
            })
        }
    });

    $("#addmenuinfo").on('click',function(){
        layer.open({
            type: 2,
            title: '添加菜单页面',
            shadeClose: true,
            shade: false,
            maxmin: false, //开启最大化最小化按钮
            area: ['893px', '600px'],
            content: '/views/setup/menu_add.html?names=menuadd&type=2',
            skin: '',
            end: function () {
                // 关闭页面时，刷新数据
                getmenulist();
            }
        })
    })


    exports('setinfo');
});
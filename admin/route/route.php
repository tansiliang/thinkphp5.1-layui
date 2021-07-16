<?php

// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2018 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

#Route::get('think', function () {
#    return 'hello,ThinkPHP5!';
#});

#Route::get('hello/:name', 'index/hello');

#后台接口
#登录
Route::get("admin_login","admin/login/admin_login");
Route::post("admin_login","admin/login/admin_login");
Route::options("admin_login","admin/login/admin_login");
#菜单列表 参数：u_id:管理员ID
Route::get("menu_list","admin/login/menu_list");
#退出登录 u_id:管理员ID
Route::get("logout_info","admin/Login/logout_info");
#通过token获取用户信息
Route::get("token_login","admin/Login/token_login");
#分配权限数据
Route::get("menuinfo_rbct","admin/Login/menuinfo_rbct");
#保存分配权限数据
Route::post("menuinfo_rbctpost","admin/Login/menuinfo_rbctpost");
#管理员列表 
Route::get('adminuserlist',"admin/User/administrators_list");
#添加管理员数据
Route::post("administrators_add","admin/User/administrators_add");
#编辑管理员页面数据
Route::get("administrators_edit","admin/User/administrators_edit");
#保存管理员数据
Route::post("administrators_editpost","admin/User/administrators_editpost");
#角色列表
Route::get("role_list","admin/User/role_list");
#添加角色方法
Route::post("role_addpost","admin/User/role_addpost");
#编辑角色页面数据
Route::get("role_edit","addmin/User/role_edit");
#编辑角色方法
Route::post("role_editpost","admin/User/role_editpost");
#删除角色
Route::post("role_delete","admin/User/role_delete");
#菜单列表
Route::get("menuinfo_list","admin/User/menuinfo_list");
#添加上级菜单列表数据
Route::get("menuinfo_add","admin/User/menuinfo_add");
#添加菜单数据接口
Route::post("menuinfo_addpost","admin/User/menuinfo_addpost");
#菜单编辑数据
Route::get("menuinfo_edit","admin/User/menuinfo_edit");
#保存菜单编辑数据
Route::post("menuinfo_editpost","admin/User/menuinfo_editpost");
#删除菜单
Route::post("menuinfo_delete","admin/User/menuinfo_delete");

return [
    
];

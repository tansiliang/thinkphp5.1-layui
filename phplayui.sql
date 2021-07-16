/*
 Navicat MySQL Data Transfer

 Source Server         : mamp本地
 Source Server Type    : MySQL
 Source Server Version : 50721
 Source Host           : 127.0.0.1:8889
 Source Schema         : phplayui

 Target Server Type    : MySQL
 Target Server Version : 50721
 File Encoding         : 65001

 Date: 16/07/2021 17:01:12
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for pl_menuinfo
-- ----------------------------
DROP TABLE IF EXISTS `pl_menuinfo`;
CREATE TABLE `pl_menuinfo` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '方法id',
  `jump` varchar(100) NOT NULL DEFAULT 'javascript:;' COMMENT '跳转地址',
  `title` varchar(100) NOT NULL DEFAULT '' COMMENT '标题',
  `name` varchar(50) NOT NULL DEFAULT '' COMMENT '文件名称',
  `icon` varchar(50) NOT NULL DEFAULT '' COMMENT '图标',
  `starts` int(2) NOT NULL DEFAULT '1' COMMENT '是否显示，0为不显示，1为显示',
  `p_id` int(11) NOT NULL DEFAULT '0' COMMENT '父类id',
  `sort` tinyint(2) NOT NULL DEFAULT '0' COMMENT '排序',
  `types` int(2) NOT NULL DEFAULT '1' COMMENT '功能类型：1菜单，2页面，3按钮',
  `createtime` int(11) NOT NULL DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pl_menuinfo
-- ----------------------------
BEGIN;
INSERT INTO `pl_menuinfo` VALUES (1, 'javascript:;', '主页', '', '&#xe609;', 1, 0, 1, 1, 0);
INSERT INTO `pl_menuinfo` VALUES (2, 'views/index/console.html', '控制台', '', '', 1, 1, 1, 1, 0);
INSERT INTO `pl_menuinfo` VALUES (5, 'javascript:;', '设置', 'set', '&#xe716;', 1, 0, 2, 1, 0);
INSERT INTO `pl_menuinfo` VALUES (9, 'javascript:;', '我的设置', 'user', '', 0, 5, 2, 1, 0);
INSERT INTO `pl_menuinfo` VALUES (10, 'set/user/info', '基本资料', 'info', '', 0, 0, 2, 1, 0);
INSERT INTO `pl_menuinfo` VALUES (11, 'set/user/password', '修改密码', 'password', '', 0, 0, 2, 1, 0);
INSERT INTO `pl_menuinfo` VALUES (12, 'javascript:;', '后台设置', 'menu', '', 1, 5, 2, 1, 0);
INSERT INTO `pl_menuinfo` VALUES (13, 'views/setup/users.html', '后台管理员', 'list', '', 1, 12, 2, 1, 0);
INSERT INTO `pl_menuinfo` VALUES (14, 'views/setup/role_list.html', '角色管理', 'role', '', 1, 12, 2, 1, 0);
INSERT INTO `pl_menuinfo` VALUES (15, 'views/setup/menulist.html', '菜单列表', '', '', 1, 12, 2, 1, 0);
COMMIT;

-- ----------------------------
-- Table structure for pl_role
-- ----------------------------
DROP TABLE IF EXISTS `pl_role`;
CREATE TABLE `pl_role` (
  `role_id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(32) NOT NULL COMMENT '角色名称',
  `role_dec` varchar(255) NOT NULL DEFAULT '0' COMMENT '角色描述',
  `role_status` char(2) NOT NULL DEFAULT '1' COMMENT '状态：-1删除 0 禁用 1正常',
  `role_path` varchar(255) NOT NULL DEFAULT '0' COMMENT '树路径',
  `user_sign` varchar(2) NOT NULL DEFAULT '0' COMMENT '管理员标识：对应user_sign',
  `create_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '创建ID',
  `create_time` int(11) NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int(11) NOT NULL DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`role_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pl_role
-- ----------------------------
BEGIN;
INSERT INTO `pl_role` VALUES (1, '超级管理员', '拥有网站最高管理员权限', '1', '0', '0', 1, 1625496341, 1625496341);
INSERT INTO `pl_role` VALUES (2, '运营管理', '用于运营使用', '1', '0', '0', 0, 1625496341, 1625587976);
COMMIT;

-- ----------------------------
-- Table structure for pl_role_menu
-- ----------------------------
DROP TABLE IF EXISTS `pl_role_menu`;
CREATE TABLE `pl_role_menu` (
  `menu_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '功能(菜单)ID',
  `role_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '角色ID，对应角色表ID',
  `create_time` int(11) NOT NULL DEFAULT '0' COMMENT '创建时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pl_role_menu
-- ----------------------------
BEGIN;
INSERT INTO `pl_role_menu` VALUES (1, 2, 1625673272);
INSERT INTO `pl_role_menu` VALUES (2, 2, 1625673272);
INSERT INTO `pl_role_menu` VALUES (12, 2, 1625673272);
INSERT INTO `pl_role_menu` VALUES (13, 2, 1625673272);
INSERT INTO `pl_role_menu` VALUES (14, 2, 1625673272);
INSERT INTO `pl_role_menu` VALUES (5, 2, 1625673272);
COMMIT;

-- ----------------------------
-- Table structure for pl_role_user
-- ----------------------------
DROP TABLE IF EXISTS `pl_role_user`;
CREATE TABLE `pl_role_user` (
  `user_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '管理员ID',
  `role_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '角色ID，对应角色表ID',
  `create_time` int(11) NOT NULL DEFAULT '0' COMMENT '创建时间'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pl_role_user
-- ----------------------------
BEGIN;
INSERT INTO `pl_role_user` VALUES (2, 2, 1625675618);
COMMIT;

-- ----------------------------
-- Table structure for pl_user
-- ----------------------------
DROP TABLE IF EXISTS `pl_user`;
CREATE TABLE `pl_user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `user_mobile` varchar(15) NOT NULL DEFAULT '0' COMMENT '手机号码',
  `user_type` tinyint(3) NOT NULL DEFAULT '2' COMMENT '用户类型;1:admin;2:会员',
  `user_login` varchar(60) NOT NULL COMMENT '用户名',
  `user_pass` varchar(64) NOT NULL COMMENT '登录密码;md5加密',
  `user_nickname` varchar(50) DEFAULT NULL COMMENT '用户昵称',
  `user_email` varchar(100) DEFAULT NULL COMMENT '用户登录邮箱',
  `user_logintime` int(11) NOT NULL DEFAULT '0' COMMENT '登录时间',
  `last_ip` varchar(15) NOT NULL DEFAULT '0' COMMENT '最后登录ip',
  `avatar` varchar(255) DEFAULT NULL COMMENT '用户头像',
  `signature` varchar(255) DEFAULT NULL COMMENT '用户个性签名',
  `user_status` tinyint(2) NOT NULL DEFAULT '1' COMMENT '管理员状态：-1 -删除 0 禁用 1 正常',
  `user_sign` tinyint(2) unsigned NOT NULL DEFAULT '0' COMMENT '管理员标记：1超级管理员 2一般管理员 ',
  `salt` varchar(11) NOT NULL DEFAULT '0' COMMENT '对密码加密的随机值',
  `create_id` int(11) unsigned NOT NULL DEFAULT '0' COMMENT '创建ID',
  `create_time` int(11) NOT NULL DEFAULT '0' COMMENT '创建时间',
  `access_token` varchar(255) NOT NULL COMMENT 'token',
  `expires_time` int(11) DEFAULT NULL COMMENT 'token过期时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of pl_user
-- ----------------------------
BEGIN;
INSERT INTO `pl_user` VALUES (1, '0', 1, 'admin', 'e6ee2179f746c11a84ea29b83cde8edd', NULL, NULL, 1626230403, '0.0.0.0', NULL, NULL, 1, 1, '57096', 0, 0, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIiLCJhdWQiOiIiLCJsYXQiOjE2MjYyMzA0MDMsIm5iZiI6MTYyNjIzMDQxMywiZXhwIjoxNjI2MzE2ODAzLCJ1aWQiOjEsInBhc3N3b3JkIjoiYWRtaW4iLCJtb2JpbGUiOiJhZG1pbiJ9.Y2qpo6C3nC4nWNmCQtD92Y4dfbaH5I4202rbmGNjx90', 1626316803);
INSERT INTO `pl_user` VALUES (2, '12345678901', 1, 'ceshi', '7b825ac5bc24aeeeb374440f6bdbf177', '测试', NULL, 1625675618, '0.0.0.0', NULL, NULL, 1, 2, '689231', 0, 1625672710, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiIiLCJhdWQiOiIiLCJsYXQiOjE2MjU2NzMyODgsIm5iZiI6MTYyNTY3MzI5OCwiZXhwIjoxNjI1NzU5Njg4LCJ1aWQiOjIsInBhc3N3b3JkIjoiMTIzNDU2IiwibW9iaWxlIjoiY2VzaGkifQ.9kkvFV8mxuJhugkvHeih7k5MoYqtzNvqmXedZASkmAA', 1625759688);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;

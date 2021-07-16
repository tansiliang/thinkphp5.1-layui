layui.define(function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
    var obj = {
     api:"http://phplayui.com:8888/"  //后台接口地址
    };
    
    exports('http', obj);
  });
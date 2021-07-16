/**
 *  入口文件索引
 *  使用说明：将此文件引入到页面中，可在script标签上定义一个data-main=""属性，
 *  此属性指定页面入口文件。
 *
**/
(function () {

    var entry,baseinfo,
        // 配置所有应用的入口文件，程序将会按照data-main属性中设置的值进行索引查找
        // 如果你在引入此脚本的script标签上没有设置data-main属性，程序将会默认访问home.js文件
        app = {
            home : '{/}controller/home',
            login : '{/}controller/login',
            http:'assets/lay/modules/expand/http',
            tab:'assets/lay/modules/expand/openthepage',
            setinfo:'../controller/setinfo',//二级页面控制器
            threesetinfo:'controller/threesetinfo',//弹窗页面控制器（三级）
            echarts:'assets/lay/modules/expand/echarts',//图表,
            console:"../controller/console",//控制台
        };
    (function(){

        // console.log(app)
        var dataMain, scripts = document.getElementsByTagName('script'),dataInfo,
            eachScripts = function(el){
                dataMain = el.getAttribute('data-main');
                
                // dataInfo = el.getAttribute('data-info');
                // if(dataInfo == 'controller'){
                //     entry = '../'+dataMain;
                // }else{
                    if(dataMain){
                        entry = dataMain;
                    }
                // }
            };
        [].slice.call(scripts).forEach(eachScripts);

    })();

    layui.config({
        base: '/'
    }).extend(app).use(entry || 'home');

})();
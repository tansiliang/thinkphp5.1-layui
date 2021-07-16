// 打开页面
layui.define(['element','layer'],function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback); 

    var $ = layui.$,element = layui.element;

        var Tab = function(el){
            console.log(el)
            this.el = el;
            this.urls = [];
        }
    
        Tab.prototype.content = function(src) {
            
            var iframe = document.createElement("iframe");
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("src", src);
            iframe.setAttribute("data-id", this.urls.length);
            return iframe.outerHTML;
        };
    
        Tab.prototype.is = function(url) {
            return (this.urls.indexOf(url) !== -1)
        };
    
        Tab.prototype.add = function(title, url) {
            if(this.is(url)) return false;
            this.urls.push(url);
            element.tabAdd(this.el, {
                title : title
                ,content : this.content(url)
                ,id : url
            });
            this.change(url);
        };
    
        Tab.prototype.change = function(url) {
            element.tabChange(this.el, url);
        };
    
        Tab.prototype.delete = function(url) {
            element.tabDelete(this.el, url);
        };
    
        Tab.prototype.onChange = function(callback){
            element.on('tab('+this.el+')', callback);
        };
    
        Tab.prototype.onDelete = function(callback) {
            var self = this;
            element.on('tabDelete('+this.el+')', function(data){
                var i = data.index;
                self.urls.splice(i,1);
                callback && callback(data);
            });
        };

        var obj = {
            tab:function(el){
                return new Tab(el);
            }
        };
    
    exports('tab', obj);
  });
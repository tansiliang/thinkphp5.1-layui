layui.define(['element', 'form', 'layer', 'http', 'echarts'], function (exports) {

    var $ = layui.$, form = layui.form, layer = layui.layer, http = layui.http, echarts = layui.echarts;
    /**
     * 图表数据
     */
    function getcanvasinfo() {
        var widths = $("#getcanvaswidth").width();
        $("#getcanvas").width(widths);
        var chartZhu = echarts.init(document.getElementById('getcanvas'));
        //指定图表配置项和数据
        var option = {
            title: {
                text: '数据图表'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data: ['新增用户', '交易订单', '营业额']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '新增用户',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: '交易订单',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name: '营业额',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {},
                    emphasis: {
                        focus: 'series'
                    },
                    data: [150, 232, 201, 154, 190, 330, 410]
                }
            ]
        };
        chartZhu.setOption(option);
        chartZhu.resize();
    }
    getcanvasinfo();




    exports('console');
});
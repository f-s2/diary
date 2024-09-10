<template>
    <view class="charts-box">
        <qiun-data-charts type="mix" :opts="opts" :chartData="chartData" />
    </view>
</template>

<script>
export default {
    props: {
        dataSource: {
            type: Array,
            default: () => []
        }
    },
    computed() {

    },
    data() {
        return {
            chartData: {},

            opts: {
                color: ["#0B66C6", "#14C9C9", "#14C9C9",],
                padding: [15, 0, 0, 5],
                enableScroll: false,
                dataLabel: false,
                legend: {
                    show: false
                },
                xAxis: {
                    disableGrid: true,
                    labelCount: 5
                },
                yAxis: {
                    data: [
                        {
                            position: "left",
                            title: '数量'
                        },
                        {
                            position: "right",
                            title: '完成率',
                            textAlign: "right",

                        },

                    ]
                },
                extra: {
                    mix: {
                        column: {
                            width: 8,
                            barBorderCircle: true,
                        }

                    }
                }


            }
        };
    },
    mounted() {
        this.getServerData();
    },
    methods: {
        getServerData() {
            //模拟从服务器获取数据时的延时
            setTimeout(() => {
                //模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
                let res = {
                    categories: this.dataSource.map(item => item.time),
                    series: [
                        {
                            name: "已完成",
                            type: "column",
                            index: 0,
                            data: this.dataSource.map(item => +item.finished)
                        },
                        {
                            name: "总数",
                            type: "column",
                            index: 0,

                            data: this.dataSource.map(item => item.total)
                        },
                        {
                            name: "完成率",
                            type: "line",
                            index: 1,

                            data: this.dataSource.map(item => item.finishRate)
                        }
                    ]
                };
                console.log(res, this.dataSource);
                this.chartData = JSON.parse(JSON.stringify(res));
            }, 3000);
        },
    }
};
</script>

<style scoped>
/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
.charts-box {
    width: 100%;
    height: 600rpx;
}
</style>
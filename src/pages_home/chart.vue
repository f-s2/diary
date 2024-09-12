<template>
    <view class="charts-box">
        <qiun-data-charts ref="chartRef" type="mix" :opts="opts" :chartData="chartData" />
    </view>
</template>

<script>
import dayjs from 'dayjs';

export default {
    props: {
        dataSource: {
            type: Array,
            default: () => []
        },
        mode: String
    },

    data() {
        return {
            chartData: {},

            opts: {
                color: ["#0B66C6", "rgba(20, 201, 201, 0.5)", "#14C9C9",],
                padding: [15, 10, 0, 5],
                enableScroll: false,
                dataLabel: false,
                legend: {
                    show: false
                },
                xAxis: {
                    disableGrid: true,
                    labelCount: 8
                },
                yAxis: {
                    data: [
                        {
                            position: "left",
                            title: '数量',
                            axisLine: false
                        },
                        {
                            position: "right",
                            title: '完成率(%)',
                            axisLine: false

                        },

                    ]
                },
                extra: {
                    mix: {
                        column: {
                            width: 8
                        },
                        line: {
                            width: 2
                        }

                    },


                }


            }
        };
    },

    watch: {
        dataSource: {
            handler(val) {
                val?.length && this.getServerData()

            }
            , immediate: false
        }
    },
    methods: {
        getServerData() {

            const data = {
                categories: this.dataSource.map(item => this.mode === 'D' ? dayjs(item.time).get(this.mode) + '号' : dayjs(item.time).get(this.mode) + 1 + '月'),
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
                        data: this.dataSource.map(item => +item.total)
                    },
                    {
                        name: "完成率",
                        type: "line",
                        index: 1,
                        data: this.dataSource.map(item => +item.finishRate),

                        setShadow: [
                            3,
                            8,
                            10,
                            "#1890FF"
                        ],
                    },

                ]
            };

            this.chartData = data;
        },
    }
};
</script>

<style scoped>
/* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
.charts-box {
    width: 100%;
    height: 450rpx;
    margin-top: 48rpx;
}
</style>
<template>
	<div ref="mychart" class="content"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';
const mychart = ref(null);
onMounted(() => {
	//初始化echarts实例
	let myEcharts = echarts.init(mychart.value);
	// 指定图表的配置项和数据
	const option = {
    title:{
      text:'饼状图',
      left: 'center',
      textStyle: {
				fontSize: 20,
				fontWeight: 'bolder',
				overflow: 'none',
				color: 'rgb(123, 219, 180)',
			},
    },
    legend: {
    orient: 'vertical',
    left: 10,
    textStyle: {
				color: '#fff',
			},
  },
  series: [
    {
      type: 'pie',
      data: [
        {
          value: 335,
          name: '直接访问'
        },
        {
          value: 234,
          name: '联盟广告'
        },
        {
          value: 1548,
          name: '搜索引擎'
        }
      ]
    }
  ]
};
	// 使用刚指定的配置项和数据显示图表。
	myEcharts.setOption(option);
});
</script>

<style scoped>
.content {
	height: 250px;
	width: 60%;
	margin-top: 30px;
}
</style>

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
	let option = {
		title: {
			text: '入门示例',
			textStyle: {
				fontSize: 25,
				fontWeight: 'bolder',
				overflow: 'none',
				color: 'rgb(103, 219, 180)',
			},
			textAlign: 'left',
			left: 'center',
		},
		tooltip: {
			//弹出框
			trigger: 'axis', //触发类型: 坐标轴
			axisPointer: {
				//坐标轴指示器
				type: 'shadow',
			},
			//  formatter(params){
			//   console.log(params.length)
			//  }
			formatter: function (params) {
				//框浮层内容格式器
				for (let i = 0; i < params.length; i++) {
					//                 数据名                   数据值
					return `${params[i].name} 价格:${params[i].data.price}$ <br />销量:${params[i].data.value}`;
				}
			},
		},
		legend: {
			//图例
			data: ['销量'],
			icon: 'circle',
			right: '10%',
			textStyle: {
				color: '#fff',
			},
		},
		xAxis: {
			xAxis: { type: 'value' }, //数值轴
			data: ['Latte', 'Milk Tea', 'Cocoa', 'Brownie'],
		},
		yAxis: {},
		series: [
			{
				name: '销量',
				type: 'bar',
				data: [
					{ price: '20', value: 43.3 }, //单柱样式
					{ price: '10', value: 83.1 },
					{ price: '14', value: 86.4 },
					{ price: '22', value: 72.4 },
				],
				markPoint: {
					data: [
						{
							type: 'max',
							name: '最大值',
						},
						{
							type: 'min',
							name: '最小值',
						},
					],
				},
				markLine: {
					data: [
						{
							type: 'average',
							name: '平均值',
						},
					],
				},
				itemStyle: {
					//图形样式
					normal: {
						color: function (params) {
							const colorList = ['#c23532', '#c56632', '#a09932', '#fff'];
							return colorList[params.dataIndex];
						},
						borderRadius: [10, 10, 0, 0],
						shadowBlur: {
							shadowColor: 'rgba(0, 0, 0, 0.5)',
							shadowBlur: 10,
						},
					},
				},
			},
		],
	};
	// 使用刚指定的配置项和数据显示图表。
	myEcharts.setOption(option);
});
</script>

<style scoped>
.content {
	height: 400px;
	width: 100%;
	margin-top: 30px;
}
</style>

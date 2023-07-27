import { createStore } from 'vuex';
import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

const store = createStore({
	state() {
		return {
			searchResults: null,
			/*
				SAMPLE:
				[{name,adcode},{},{}...]
				*/
			savedCities: [
				/*
				SAMPLE:
				name,
				adcode,
				id,
				<weather>,
				*/
			],
			searchedCity: null,
			/*
				SAMPLE:
				name,
				adcode,
				weather
				*/
			indexGroup: [
				{
					id: 'rh',
					indexName: '湿度',
					details: [
						{
							caption: '相对湿度',
							description:
								'一般简称为湿度，是空气中含水量与空气可容纳水量的比值。气温越高，空气可容纳的水量就多。若相对湿度接近100%，则意味着可能结露或起雾。',
						},
						{
							caption: '露点温度',
							description:
								'露点温度是露水凝结所需降至的温度。它可用于判断人体所感觉的空气湿度，露点温度越高，体感温度越高。若露点温度与当前温度相同，则意味着相对湿度达100%，可能结露或起雾。',
						},
					],
					overview: {
						caption: '每日概要',
					},
				},
				{
					id: 'temp_fc',
					indexName: '温度',
					details: [],
					overview: {
						caption: '天气预报',
					},
				},
				{
					id: 'feels_like',
					indexName: '体感温度',
					details: [
						{
							caption: '体感温度',
							description:
								'体感温度传达身体感觉有多暖或多冷，可能与实际温度不同。体感温度受湿度和风影响。',
						},
					],
					overview: {
						caption: '每日概要',
					},
				},
			],
		};
	},
	mutations,
	actions,
	getters,
});

export default store;

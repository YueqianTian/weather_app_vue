import * as config from '../assets/js/config.js';
import areacode from '../assets/json/areacodeConversion.json';
import executeSearchStrategy from '../assets/js/areaSearchStrategy.js';
import axios from 'axios';

export default {
	getSavedCities(context) {
		if (localStorage.getItem('savedCities')) {
			context.commit(
				'setCities',
				JSON.parse(localStorage.getItem('savedCities'))
			);
		}
	},

	storeSavedCities(_, payload) {
		localStorage.setItem('savedCities', JSON.stringify(payload));
	},

	async getWeatherData(_, payload) {
		if (!payload.adcode) return;

		// Find areacode
		const selectedAreacode = areacode.find(
			(city) => city.adcode === payload.adcode
		)?.areacode;

		if (!selectedAreacode) {
			const error = 'Areacode not defined!';
			throw new Error(error);
		}

		// Send Request
		const endpoints = [
			`${config.REQUEST_BASE_URL_APISPACE}/456456/weather/v001/hour?hours=${config.FCST_HOURS}&areacode=${selectedAreacode}`,
			`${config.REQUEST_BASE_URL_APISPACE}/456456/weather/v001/day?days=${config.FCST_DAYS}&areacode=${selectedAreacode}`,
			`${config.REQUEST_BASE_URL_APISPACE}/ewre/lives_geo/v001/sun?days=${config.FCST_SUNRISES_DAYS}&areacode=${selectedAreacode}`,
		];

		const response = await axios.all(
			endpoints.map((endpoint) => {
				return axios.get(endpoint, {
					headers: {
						'X-APISpace-Token': config.APISPACE_API_KEY,
						'Authorization-Type': 'apikey',
						Accept: 'application/json',
					},
				});
			})
		);

		// Handle weather data
		const [responseData1, responseData2, responseData3] = response;
		const responseData = {
			hourly: responseData1.data.result.hourly_fcsts,
			daily: responseData2.data.result.daily_fcsts,
			sunrises: responseData3.data.result.sunrises,
		};
		return responseData;
	},

	preProcessSearchTerm(_, payload) {
		// Need to pre-process if search terms are Municipality(直辖市) or Special Administrative Region(特别行政区) or Province(省份)
		const regexKeywords_1 = /(^北京|^上海|^重庆|^天津)/gs;
		const regexKeywords_2 = /(^澳门|^香港)/gs;
		const regexKeywords_3 =
			/(^云南|^吉林|^四川|^安徽|^山东|^山西|^广东|^江苏|^江西|^河北|^河南|^浙江|^海南|^湖北|^湖南|^甘肃|^福建|^贵州|^辽宁|^陕西|^青海|^黑龙江)/gs;
		const hasMatchedWords_1 = payload.match(regexKeywords_1);
		const hasMatchedWords_2 = payload.match(regexKeywords_2);
		const hasMatchedWords_3 = payload.match(regexKeywords_3);

		if (!!hasMatchedWords_1) {
			return hasMatchedWords_1[0] + '城区';
		}
		if (!!hasMatchedWords_2) {
			return hasMatchedWords_2[0] + '特别行政区';
		}
		if (!!hasMatchedWords_3) {
			return hasMatchedWords_3[0] + '省';
		}
		return payload;
	},

	async getCityData(context, payload) {
		// Pre-process search term
		const filteredSearchTerm = await context.dispatch(
			'preProcessSearchTerm',
			payload
		);

		// Send request
		const url = `https://restapi.amap.com/v3/config/district?keywords=${filteredSearchTerm}&key=${config.AMAP_API_KEY}`;
		const response = await fetch(url, {
			method: 'GET',
			headers: { Accept: 'application/json' },
		});
		const responseData = await response.json();

		if (!response.ok) {
			console.log('Response status is NOT ok');
			const error = new Error(
				responseData.message ||
					'Failed to get adminstrative divisions. Check up your searching data.'
			);
			throw error;
		}
		return responseData;
	},

	handleCityData(context, payload) {
		// if search result ===1
		if (+payload?.count === 1) {
			// Use AreaSearchStrategy to get results
			context.commit(
				'setSearchResults',
				executeSearchStrategy(payload?.districts[0])
			);
		}
		// if search result ===0 || >1
		else {
			context.commit('setSearchResults', payload?.districts);
		}
	},
};

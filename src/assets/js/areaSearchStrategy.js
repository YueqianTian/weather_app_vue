/* Display strategies of search query:
		1. level: country =>  Municipality + Province + Special Administrative Region (SAR) + Autonomous Region
		2. level: province  =>  subdistricts (exception：SAR => SAR + subdistricts)
		3. level: city => city + subdistricts (including Municipality）
        4. level: street  => no result (because of no weather data )
 */

import adcodeOfChina from '../json/adcodeOfChina.json';
import adcodeOfTaiwan from '../json/adcodeOfTaiwan.json';

class AreaSearchStrategy {
	constructor(districts, adcode, name) {
		this.districts = districts;
		this.name = name;
		this.adcode = adcode;
	}

	// strategy: country
	country() {
		// if search China, return adminstration centers
		return adcodeOfChina;
	}

	// strategy: province
	province() {
		const keywordIndex_1 = this.name.indexOf('特别行政区');
		const keywordIndex_2 = this.name.indexOf('台湾');

		// AMAP API lack of subdistricts data for Taiwan Province (台湾省), see pack in json folders
		if (keywordIndex_2 !== -1) {
			return adcodeOfTaiwan;
		}
		// if search SAR (特别行政区)，return SAR and its subdistricts
		else if (keywordIndex_1 !== -1) {
			return [
				{ name: this.name, adcode: this.adcode },
				...this.districts,
			];
		} else {
			return this.districts;
		}
	}

	// strategy: city
	city() {
		return [
			// 直辖市返回 市 + 区
			{ name: this.name.replace('城区', '市'), adcode: this.adcode },
			...this.districts,
		];
	}

	// strategy: district
	district() {
		return [{ name: this.name, adcode: this.adcode }];
	}

	// strategy: street
	street() {
		return;
	}
}

export default function executeSearchStrategy(result) {
	const { districts, adcode, name, level } = result;
	const selectedStategy = new AreaSearchStrategy(districts, adcode, name);
	return selectedStategy[level]();
}

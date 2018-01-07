const csv = require('csvtojson');
const axios = require('axios');
const fs = require('fs');

console.log('Getting latest datasets......');
axios.get('https://data.gov.tw/datasets/export/csv')
.then(r => {
	console.log('Converting to JSON......');
	const content = [];
	csv()
	.fromString(r.data)
	.on('json', (json) => {
		content.push(json);
	})
	.on('done', (err) => {
		const categories = {};
		console.log('Analyzing......');
		Array.from(content).forEach(dataset => {
			categories[dataset['提供機關']] = categories.hasOwnProperty(dataset['提供機關']) ? categories[dataset['提供機關']] + 1 : 1;
		});

		const categoriesArr = [];
		Object.keys(categories).forEach((key) => {
			categoriesArr.push({
				name: key,
				value: categories[key],
			});
		});

		const final = [];
		Array.from(categoriesArr).forEach(d => {
			const n = d.name;

			if(n.includes('臺北')){
				d.group = '臺北市';
			}else if(n.includes('雲林')){
				d.group = '雲林縣';
			}else if(n.includes('屏東')){
				d.group = '屏東縣';
			}else if(n.includes('新北')){
				d.group = '新北市';
			}else if(n.includes('基隆')){
				d.group = '基隆市';
			}else if(n.includes('臺東')){
				d.group = '臺東縣';
			}else if(n.includes('桃園')){
				d.group = '桃園市';
			}else if(n.includes('嘉義縣')){
				d.group = '嘉義縣';
			}else if(n.includes('花蓮')){
				d.group = '花蓮縣';
			}else if(n.includes('新竹縣')){
				d.group = '新竹縣';
			}else if(n.includes('嘉義市')){
				d.group = '嘉義市';
			}else if(n.includes('金門縣')){
				d.group = '金門縣';
			}else if(n.includes('新竹市')){
				d.group = '新竹市';
			}else if(n.includes('臺南市')){
				d.group = '臺南市';
			}else if(n.includes('澎湖')){
				d.group = '澎湖縣';
			}else if(n.includes('宜蘭')){
				d.group = '宜蘭縣';
			}else if(n.includes('高雄')){
				d.group = '高雄市';
			}else if(n.includes('臺中')){
				d.group = '臺中市';
			}else if(n.includes('臺南')){
				d.group = '臺南市';
			}else if(n.includes('苗栗縣')){
				d.group = '苗栗縣';
			}else if(n.includes('彰化縣')){
				d.group = '彰化縣';
			}else if(n.includes('南投縣')){
				d.group = '南投縣';
			}

			if(d.group) final.push(d);

			// const n = d.name;
			// if(n === ''){
			// 	d.group = '未命名';
			// }
			// else if(n.includes('府') || n.includes('縣') || n.includes('公所') || n.includes('省') ||
			// (n.includes('縣') && n.includes('局')) || (n.includes('市') && n.includes('局')) ||
			// (n.includes('縣') && n.includes('處')) || (n.includes('市') && n.includes('處')) ||
			// n.includes('桃園') || n.includes('臺北') || n.includes('臺中') || n.includes('衛武營')){

			// 	d.group = '地方政府';
			// }else if(n.includes('大學')){
			// 	d.group = '大學';
			// }else if(n.includes('公司')){
			// 	d.group = '國營事業/官股公司';
			// }else if(n.includes('部') || n.includes('院') || n.includes('委員會') ||
			// n.includes('中央') || n.includes('銀行') || n.includes('國立') || n.includes('處') || n.includes('中心') ||
			// n.includes('司') || n.includes('局') || n.includes('署') || n.includes('室') || n.includes('館') || n.includes('會議')){
			// 	d.group = '中央政府';
			// }else{
			// 	d.group = '未分類';
			// }
		});

		console.log(final);

		final.sort((a, b) => b.value - a.value);

		const data = {
			content: final,
			lastModified: new Date(),
		}

		fs.writeFileSync(`${__dirname}/docs/data/data_freq.json`, JSON.stringify(data), 'utf-8');
	});
});

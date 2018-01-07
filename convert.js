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

		Array.from(categoriesArr).forEach(d => {
			const n = d.name;
			if(n === ''){
				d.group = '未命名';
			}
			else if(n.includes('府') || n.includes('縣') || n.includes('公所') || n.includes('省') ||
			(n.includes('縣') && n.includes('局')) || (n.includes('市') && n.includes('局')) ||
			(n.includes('縣') && n.includes('處')) || (n.includes('市') && n.includes('處')) ||
			n.includes('桃園') || n.includes('臺北') || n.includes('臺中') || n.includes('衛武營')){

				d.group = '地方政府';
			}else if(n.includes('大學')){
				d.group = '大學';
			}else if(n.includes('公司')){
				d.group = '國營事業/官股公司';
			}else if(n.includes('部') || n.includes('院') || n.includes('委員會') ||
			n.includes('中央') || n.includes('銀行') || n.includes('國立') || n.includes('處') || n.includes('中心') ||
			n.includes('司') || n.includes('局') || n.includes('署') || n.includes('室') || n.includes('館') || n.includes('會議')){
				d.group = '中央政府';
			}else{
				d.group = '未分類';
			}
		})

		categoriesArr.sort((a, b) => b.value - a.value);

		const data = {
			content: categoriesArr,
			lastModified: new Date(),
		}

		fs.writeFileSync(`${__dirname}/docs/data/data_freq.json`, JSON.stringify(data), 'utf-8');
	});
});

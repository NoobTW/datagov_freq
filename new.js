const csv = require('csvtojson');
const fs = require('fs');

const content = [];

csv()
.fromFile('./data22_mar_b.csv')
.on('json', (d) => {
	if(d['編號'] !== '編號'){
		d.name = d['第一層級'] + d['第二層級'];
		content.push(d);
	}
}).on('done', (err) => {
	console.log(content.length);
	const categories = {};
	console.log('Analyzing......');
	Array.from(content).forEach(dataset => {
		categories[dataset.name] = categories.hasOwnProperty(dataset.name) ? categories[dataset.name] + 1 : 1;
	});

	// console.log(categories);

	const categoriesArr = [];
	Object.keys(categories).forEach((key) => {
		if(key && key.trim() !== ''){
			categoriesArr.push({
				name: key,
				value: categories[key],
				group: key.substring(0, 3),
			});
		}
	});

	console.log(categoriesArr);

	// const final = [];

	// console.log(final);

	categoriesArr.sort((a, b) => b.value - a.value);

	const data = {
		content: categoriesArr,
		lastModified: new Date(),
	}
	fs.writeFileSync('./docs/data/data22_mar_b.json', JSON.stringify(data), 'UTF-8');
});

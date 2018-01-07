const fs = require('fs');

let content = fs.readFileSync(`${__dirname}/data/data.json`);

let k = {};

content = JSON.parse(content);

Array.from(content).forEach(dataset => {
	// let dataset = content[i];
	k[dataset['提供機關']] = k.hasOwnProperty(dataset['提供機關']) ? k[dataset['提供機關']] + 1 : 1;
});

const kk = [];

Object.keys(k).forEach((key) => {
	kk.push({
		name: key,
		value: k[key],
	});
});

kk.sort((a, b) => b.value - a.value);

fs.writeFileSync(`${__dirname}/docs/data/data_freq.json`, JSON.stringify(kk), 'utf-8');

const csv = require('csvtojson');
const {writeFileSync} = require('fs');

const k = [];

csv()
.fromFile(`${__dirname}/data/國發dataset清冊-2018Jan03.csv`)
.on('json', (json) => {
	k.push(json);
})
.on('done', (err) => {
	writeFileSync(`${__dirname}/data/data.json`, JSON.stringify(k), 'utf-8');
	console.log('done');
});

$(function(){

	$.getJSON('./data/data_freq.json', function(res){

		var sample_data = res.content;
		console.log(res.lastModified);
		$('#lm_date').text(moment(new Date(res.lastModified)).format('YYYY-MM-DD'));

		if(getParameterByName('cat') && getParameterByName('cat').trim() !== ''){
			sample_data = res.content.filter(function(x){
				return x.group === getParameterByName('cat');
			});
		}

		var visualization = d3plus.viz()
		.container("#viz")
		.data(sample_data)
		.type("bubbles")
		.id(["group", "name"])
		.depth(1)
		.size("value")
		.color("name")
		.background("#F2F2F2")
		.draw()
	});
});

$('body').delegate('text', 'click', function(){
	if($(this).attr('id').startsWith('d3plus_label_null'))
		location.href = location.protocol + '//' + location.host + location.pathname + '?cat=' + $(this).text();
})

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}
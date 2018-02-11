location.href = 'https://noobtw.github.io/od-freq';

$(function(){

	$.getJSON('./data/data22.json?k=2', function(res){

		var sample_data = res.content;
		console.log(res.lastModified);
		$('#lm_date').text(moment(new Date(res.lastModified)).format('YYYY-MM-DD'));

		var visulization;

		if(getParameterByName('cat') && getParameterByName('cat').trim() !== ''){
			sample_data = res.content.filter(function(x){
				return x.group === getParameterByName('cat');
			});
			visualization = d3plus.viz()
				.container("#viz")
				.data(sample_data)
				.type("tree_map")
				.id("name")
				.size("value")
				.color("name")
				.draw()
		}else{
			visualization = d3plus.viz()
				.container("#viz")
				.data(sample_data)
				.type("tree_map")
				.id("group")
				.size("value")
				.color("group")
				.draw()
		}

	});
});

$('body').delegate('g[id^="d3plus_group_"]', 'click', function(){
	if($(this).attr('id').split('_')[2].length === 3)
		location.href = location.protocol + '//' + location.host + location.pathname + '?cat=' + $(this).attr('id').split('_')[2];
});

$('h1').on('click', function(){
	location.href = location.protocol + '//' + location.host + location.pathname;
});

function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

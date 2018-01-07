
$(function(){
	var _w = 1000;
	var _h = 700;

	$.getJSON('./data/data_freq.json', function(res){
		var root = {children: res};
		var treemap = d3.layout.treemap().size([_w, _h]).sort(function(a, b){return a.value - b.value});
		var nodes = treemap.nodes(root);
		d3.select("svg").selectAll("rect").data(nodes).enter().append("rect")
		.attr({
			x: function(it) { return it.x; },
			y: function(it) { return it.y; },
			width: function(it) { return it.dx; },
			height: function(it) { return it.dy; },
			fill: "none", stroke: "black"
		});

		var xmap = d3.scale.linear().domain([0, _w]).range([0,_w]);
		var ymap = d3.scale.linear().domain([0, _h]).range([0,_h]);

		d3.select("svg").selectAll("rect").attr({
			x: function(d) { return xmap(d.x); },
			width: function(d) { return xmap(d.x + d.dx) - xmap(d.x); }
		});

		d3.select("svg").selectAll("text").data(nodes).enter().append("text")
		.attr({
			x: function(d) { return xmap(d.x + d.dx/2); },
			y: function(d) { return ymap(d.y + d.dy/2); },
			"text-anchor": "middle",
			"dominant-baseline": "central"
		})
		.text(function(d) {
			if(d.area > _w * _h / 120)
			return d.name;
		});

		var color = d3.scale.category20();
		d3.select("svg").selectAll("rect").attr({fill: function(d) {
			return color(d.name);
		}});
	});
})
var width = 300, height = 300; 
var nodes = [{value: 5}, {value: 10}, {value: 2}, 
			{value: 6}, {value: 7}, {value: 8}];

var nodeRadius = 10;

var circles = d3.select('svg')
	.selectAll('circle')
	.data(nodes)
	.enter()
	.append('circle')
	.attr('r', nodeRadius);

var texts = d3.select('svg')
	.selectAll('text')
	.data(nodes)
	.enter()
	.append('text')
	.attr('fill', 'white')
	.text(function(d) {
		return d.value;
	});

var xForce = d3.forceX().x(200).strength(1);
var yForce = d3.forceY().y(function(d){
		return d.value*10;
	});

var simulation = d3.forceSimulation(nodes)
	.force('x', xForce)
	.force('y', yForce)
	.force('collision', d3.forceCollide().radius(nodeRadius))
	.on('tick', ticked);

function ticked() {
	d3.selectAll('circle')
		.attr('cx', function(d) {
		  return d.x
		})
		.attr('cy', function(d) {
		  return d.y
		});

	d3.selectAll('text')
		.attr('dx', -4)
		.attr('dy', 4)
		.attr('x', function(d) {
		  return d.x
		})
		.attr('y', function(d) {
		  return d.y
		});
}

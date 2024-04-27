var width = 300, height = 300; 
var nodeRadius = 5;
var centerX = 150, centerY = 150;
var nodes = d3.range(50).map(function(d) {
	return {};
});

var circles = d3.select('svg')
	.selectAll('circle')
	.data(nodes)
	.enter()
	.append('circle')
	.attr('r', nodeRadius);

var radialForce = d3.forceRadial().radius(100);

var simulation = d3.forceSimulation(nodes)
	.force('r', radialForce)
	.force('collision', d3.forceCollide().radius(nodeRadius))
	.on('tick', ticked);

function ticked() {
	d3.selectAll('circle')
		.attr('cx', function(d) {
		  return d.x + centerX;
		})
		.attr('cy', function(d) {
		  return d.y + centerY;
		});
}


var width = 300, height = 300; 
var nodeRadius = 20;

var nodes = [
  {"id": "Alice"},
  {"id": "Bob"},
  {"id": "Carol"}
];

var links = [
  {"source": "Alice", "target": "Bob"},
  {"source": "Bob", "target": "Carol"}
];
console.log(links)
var lines = d3.select('svg')
	.selectAll('line')
	.data(links)
	.enter()
    .append('line')
	.attr('stroke', 'black');

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
		return d.id;
	});

var linkForce = d3.forceLink()
	.links(links)
	.id(function(d) {
		return d.id;
	})
	.distance(100);

var simulation = d3.forceSimulation(nodes)
	.force('link', linkForce)
	.force('center', d3.forceCenter(width / 2, height / 2))
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
		.attr('dx', -18)
		.attr('dy', 4)
		.attr('x', function(d) {
		  return d.x
		})
		.attr('y', function(d) {
		  return d.y
		});

	d3.selectAll('line')
		.attr('x1', function(d) {
	      return d.source.x
	    })
	    .attr('y1', function(d) {
	      return d.source.y
	    })
	    .attr('x2', function(d) {
	      return d.target.x
	    })
	    .attr('y2', function(d) {
	      return d.target.y
	    });
}

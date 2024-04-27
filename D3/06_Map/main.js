d3.json("taiwan.json").then(drawTaiwan);

function drawTaiwan(taiwan) {
  var width = 1000;
  var height = 800;

  var projection = d3.geoMercator()
        .fitExtent([[0,0], [width, height]], taiwan);
  
  var geoGenerator = d3.geoPath()
        .projection(projection);

  var paths = d3.select('svg')
        .selectAll('path')
        .data(taiwan.features)
        .enter()
        .append('path')
        .attr('stroke', "white")
        .attr('fill', 'steelblue')
        .attr('d', geoGenerator);

  var texts = d3.select('svg')
        .selectAll('text')
        .data(taiwan.features)
        .enter()
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .attr('opacity', 0.5)
        .text(function(d) {
          return d.properties.NAME_2014;
        })
        .attr('transform', function(d) {
          var center = geoGenerator.centroid(d);
          return 'translate (' + center + ')';
        });

  d3.select('svg').append('circle')
     .attr('cx', projection( [120.9575, 23.47 ])[0] )
     .attr('cy', projection( [120.9575, 23.47 ])[1] )
     .attr('fill', 'red')
     .attr('r', 5);
  
}


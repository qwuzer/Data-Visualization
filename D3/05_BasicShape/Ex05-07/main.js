var data = [
  {label: 'A', startAngle: 0, endAngle: 0.2},
  {label: 'B', startAngle: 0.2, endAngle: 0.6},
  {label: 'C', startAngle: 0.6, endAngle: 1.4},
  {label: 'D', startAngle: 1.4, endAngle: 3},
  {label: 'E', startAngle: 3, endAngle: 2* Math.PI}
];

var arcGenerator = d3.arc()
                      .innerRadius(20)
                      .outerRadius(100);

const svg = d3.select("#chart-area")
              .append("svg")
              .attr('width', 600).attr('height', 600);
const g = svg.append('g')
              .attr("transform", "translate(100,100)");

g.selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', 'orange')
    .attr('stroke', 'white');

g.selectAll('text')
  .data(data)
  .enter()
  .append('text')
  .each(function(d) {
    var centroid = arcGenerator.centroid(d);
    d3.select(this)
      .attr('x', centroid[0])
      .attr('y', centroid[1])
      .attr('dx', '-0.33em')
      .attr('dy', '0.33em')
      .text(d.label);
  });

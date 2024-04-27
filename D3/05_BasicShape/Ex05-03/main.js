var points = [
  [0, 80],
  [Math.PI * 0.25, 80],
  [Math.PI * 0.5, 30],
  [Math.PI * 0.75, 80],
  [Math.PI, 80],
  [Math.PI * 1.25, 80],
  [Math.PI * 1.5, 80],
  [Math.PI * 1.75, 80],
  [Math.PI * 2, 80]
];

var radialLineGenerator = d3.radialLine();
var pathData = radialLineGenerator(points);
const svg = d3.select("#chart-area")
              .append("svg")
              .attr('width', 600).attr('height', 600)
              .append('g')
              .attr("transform", "translate(100,100)")
              .append('path')
              .attr('d', pathData)
              .attr('fill', 'none')
              .attr('stroke', 'black');


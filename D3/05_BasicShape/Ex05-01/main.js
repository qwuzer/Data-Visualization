var points = [
  [0, 80],
  [100, 100],
  [200, 30],
  [300, 50],
  [400, 40],
  [500, 80],
];

var lineGenerator = d3.line();
// var lineGenerator = d3.line().curve(d3.curveCardinal);
var pathData = lineGenerator(points);
// var pathData = d3.line()(points);
console.log(pathData);
const svg = d3.select("#chart-area").append("svg")
              .append('path')
              .attr('d', pathData)
              .attr('fill', 'none')
              .attr('stroke', 'black');


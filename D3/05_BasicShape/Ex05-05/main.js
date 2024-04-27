var points = [
  {angle: 0, r0: 20, r1: 80},
  {angle: Math.PI * 0.25, r0: 20, r1: 40},
  {angle: Math.PI * 0.5, r0: 20, r1: 80},
  {angle: Math.PI * 0.75, r0: 20, r1: 40},
  {angle: Math.PI, r0: 20, r1: 80},
  {angle: Math.PI * 1.25, r0: 20, r1: 40},
  {angle: Math.PI * 1.5, r0: 20, r1: 80},
  {angle: Math.PI * 1.75, r0: 20, r1: 40},
  {angle: Math.PI * 2, r0: 20, r1: 80}
];

var radialAreaGenerator = d3.radialArea()
                      .angle(d=>d.angle)
                      .innerRadius(d=>d.r0)
                      .outerRadius(d=>d.r1);
var pathData = radialAreaGenerator(points);
const svg = d3.select("#chart-area")
              .append("svg")
              .attr('width', 600).attr('height', 600)
              .append('g')
              .attr("transform", "translate(100,100)")
              .append('path')
              .attr('d', pathData)
              .attr('fill', 'lightgrey');


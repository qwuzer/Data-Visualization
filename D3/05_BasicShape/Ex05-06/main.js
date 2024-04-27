var data = {
  startAngle: 0,
  endAngle: 0.25 * Math.PI,
  innerRadius: 50,
  outerRadius: 100
};

var arcGenerator = d3.arc();
var pathData = arcGenerator(data);
const svg = d3.select("#chart-area")
              .append("svg")
              .attr('width', 600).attr('height', 600)
              .append('g')
              .attr("transform", "translate(100,100)")
              .append('path')
              .attr('d', pathData)
              .attr('fill', 'orange');


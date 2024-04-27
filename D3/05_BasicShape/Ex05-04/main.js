var points = [
  {x: 0, y0: 30, y1: 80},
  {x: 100, y0: 80, y1: 100},
  {x: 200, y0: 20, y1: 30},
  {x: 300, y0: 20, y1: 50},
  {x: 400, y0: 10, y1: 40},
  {x: 500, y0: 50, y1: 80}
];

var areaGenerator = d3.area()
                      .x(d=>d.x)
                      .y0(d=>d.y0)
                      .y1(d=>d.y1);
var pathData = areaGenerator(points);
const svg = d3.select("#chart-area")
              .append("svg")
              .attr('width', 600).attr('height', 600)
              .append('g')
              .attr("transform", "translate(100,100)")
              .append('path')
              .attr('d', pathData)
              .attr('fill', 'lightgrey');


var randomX = d3.randomNormal(500 / 2, 60),
    randomY = d3.randomNormal(500 / 2, 60),
    points = d3.range(100).map(function() { 
                return [randomX(), randomY()]; });

var boundaryPoints = d3.polygonHull(points);
console.log(boundaryPoints)
var svg = d3.select('svg');
//draw convex hull
var hull = svg.append("path")
    .attr("opacity", 0.5)
    .attr("d", "M" + boundaryPoints.join("L") + "Z");

//draw data circles
var circle = svg.selectAll("circle")
  .data(points).enter()
  .append("circle")
  .attr("r", 3)
  .attr("transform", function(d) { 
    return "translate(" + d + ")"; 
  });
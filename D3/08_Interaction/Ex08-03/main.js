var width = 500;
var height = 500;
var svg = d3.select("svg");

var points = d3.range(10).map(function() {
  return {
    x: Math.random() * width, 
    y: Math.random() * height
  };
});

var drag = d3.drag()
  .on("drag", dragged)
  .on("start", started)
  .on("end", ended)

var circles = svg.selectAll('circle')
  .data(points).enter()
  .append('circle')
  .attr('fill', 'red')
  .attr('r', 10)
  .attr('cx', function(d) {
    return d.x;
  })
  .attr('cy', function(d) {
    return d.y;
  })
  .call(drag);

function dragged(d) {
  console.log("dragging");
  var mousePos = d3.mouse(this);

  var circle = d3.select(this);
  circle
    .attr('cx', mousePos[0])
    .attr('cy', mousePos[1]);
}

function started(d) {
    console.log("drag start");
}

function ended(d) {
  console.log("drag end");
}

var circle = d3.select("svg")
                  .append('circle')
                  .attr('cx', 50)
                  .attr('cy', 50)
                  .attr('r', 20)
                  .attr('fill', 'black');
circle
// Transition 1
.transition()
      .duration(2000)
      .attr("fill", "red")
// Transition 2
.transition()
      .duration(2000)
      .attr("fill", "blue")
      .attr('cx', 600)
      .attr('cy', 300)
      ;
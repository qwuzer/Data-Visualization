var data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var seqColor = d3.scaleSequential().domain([0, 9]).interpolator(d3.interpolateRainbow);

d3.select("svg").selectAll("circle").data(data)
  .enter().append("circle")
  .attr("cx", (d, i)=>((i+1)*30))
  .attr("cy", 50)
  .attr("r", "10")
  .attr("fill", (d)=>seqColor(d));
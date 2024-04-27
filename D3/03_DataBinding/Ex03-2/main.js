var data = [40, 10, 40];

d3.selectAll("rect")
  .data(data)
  .attr("x", 0)
  .attr("y", function(d, i){
      return i*15;
  })
  .attr("width", function(d, i){
      return d;
  })
  .attr("height", 10);


  
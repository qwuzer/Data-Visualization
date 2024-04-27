// d3.select("rect").attr("fill", "red");
// d3.select("#center1").attr("fill", "red");
// d3.select("#center2").attr("fill", "blue");
// d3.select(".outside").attr("fill", "red");
// d3.selectAll("rect").attr("fill", "red");
// d3.selectAll(".outside").attr("fill", "red");
var select1 = d3.selectAll("g");
select1.select("rect").attr("fill", "red");
d3.selectAll(".outside").attr("width" , "25")
// var select2 = d3.select("#group1");
// select2.selectAll("rect").attr("fill", "red");


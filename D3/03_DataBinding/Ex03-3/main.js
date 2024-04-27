var data = [20, 10, 40, 80, 30 ];

var rects = d3.select("svg").selectAll("rect").data(data);

console.log(rects);

// rects.exit().remove();
// rects.enter().append()
// d3.select("svg").selectAll("rect")
//     .attr("x", 0)
//     .attr("y" , (d,i) => i*15)
//     .attr("width", function(d, i){
//         return d;
//     })
//     .attr("height", 10)

rects.attr("x", 0)
     .attr("y" , (d,i) => i*15)
     .attr("width", function(d, i){
         return d;
     })
     .attr("height", 10)
     .attr("fill", "blue");

rects.enter()
     .append("rect")
     .attr("x", 0)
     .attr("y", function(d, i){
         return i*15;
     })
     .attr("width", function(d, i){
         return d;
     })
     .attr("height", 10)
     .attr("fill", "red");


// rects.exit().remove();
// rects.enter().append("rect");
// d3.select("svg").selectAll("rect")
//   .attr("x", 0)
//   .attr("y", function(d, i){
//       return i*15;
//   })
//   .attr("width", function(d, i){
//       return d;
//   })
//   .attr("height", 10);


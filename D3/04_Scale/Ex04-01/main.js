var cities = [
                {name: "Taipei" , population: 2602418},
                {name: "NewTaipei" , population: 4030954},
                {name: "Taoyuan" , population: 2268807},
                {name: "Taichung" , population: 2820787},
                {name: "Tainan" , population: 1874917},
                {name: "Kaohsiung" , population: 2765932},
             ];

var fontSize = 20;
var barHeight = 25;
var heightPadding = 5;

var texts = d3.select("svg").selectAll("text").data(cities);
texts.exit().remove();
texts.enter().append("text");
d3.select("svg").selectAll("text")
    .attr("x", 0)
    .attr("y", function(d, i){
        return fontSize + i*(barHeight + heightPadding);
    })
    .attr("font-size", fontSize)
    .text(function(d){
        return d.name;
    });            

var rects = d3.select("svg").selectAll("rect").data(cities);
rects.exit().remove();
rects.enter().append("rect");
d3.select("svg").selectAll("rect")
  .attr("x", 100)
  .attr("y", function(d, i){
      return i*(barHeight + heightPadding);
  })
  .attr("width", function(d, i){
      return d.population * 0.0001;
  })
  .attr("height", barHeight)
  .attr("fill", "blue");


var cities = [
                {name: "Taipei" , population: 2602418},
                {name: "NewTaipei" , population: 4030954},
                {name: "Taoyuan" , population: 2268807},
                {name: "Taichung" , population: 2820787},
                {name: "Tainan" , population: 1874917},
                {name: "Kaohsiung" , population: 2765932},
             ];

var fontSize = 18;
var barHeight = 25;
var heightPadding = 5;
var height = 200;

var cityNames = cities.map((d)=>d.name);
var scalePoint = d3.scalePoint()
                  .domain(cityNames)
                  .range([0, height])
                  .padding(0.5);

var min = d3.min(cities, d=>d.population);
console.log("min:" + min);
var max = d3.max(cities, d=>d.population);
console.log("max:" + max);
var extent = d3.extent(cities, d=>d.population);
console.log("extent:" + extent);

xScale = d3.scaleLinear()
            .domain([0, max])
            .range([0, 400]);

var texts = d3.select("svg").selectAll("text").data(cities);
texts.exit().remove();
texts.enter().append("text");
d3.select("svg").selectAll("text")
    .attr("x", 0)
    .attr("y", function(d, i){
        return scalePoint(d.name);
    })
    .attr("font-size", fontSize)
    .text(function(d){
        return d.name;
    });            

var rects = d3.select("svg").selectAll("circle").data(cities)
              .enter().append("circle")
              .attr("cx", function(d, i){
                return xScale(d.population);
              })
              .attr("cy", function(d, i){
                return scalePoint(d.name);
              })
              .attr("r", 7)
              .attr("fill", "blue");


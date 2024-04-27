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

var cityNames = cities.map((d)=>d.name);console.log(cityNames)
var bandScale = d3.scaleBand()
                  .domain(cityNames)
                  .range([0, height])//height of the whole bar chart
                  .paddingOuter(0.33)
                  .paddingInner(0.2);

xScale = d3.scaleLinear()
            .domain([0, 4030954])
            .range([0, 400]);

var texts = d3.select("svg").selectAll("text").data(cities);
texts.exit().remove();
texts.enter().append("text");
d3.select("svg").selectAll("text")
    .attr("x", 0)
    .attr("y", function(d, i){
        return bandScale(d.name)+18;
    })
    .attr("font-size", fontSize)
    .text(function(d){
        return d.name;
    });            

var rects = d3.select("svg").selectAll("rect").data(cities)
              .enter().append("rect")
              .attr("x", 100)
              .attr("y", function(d, i){
                return bandScale(d.name);
              })
              .attr("width", function(d, i){
                  return xScale(d.population);
              })
              .attr("height", bandScale.bandwidth())
              .attr("fill", "blue");


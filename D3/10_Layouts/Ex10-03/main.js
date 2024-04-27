var svg = d3.select("svg"),
			    margin = {top: 10, right: 30, bottom: 30, left: 30},
			    width = +svg.attr("width") - margin.left - margin.right,
			    height = +svg.attr("height") - margin.top - margin.bottom,
			    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = d3.range(1000).map(d3.randomNormal());
var dataExtent = d3.extent(data);

var binsGenerator = d3.histogram()
    .domain(dataExtent);

var binsData = binsGenerator(data);
console.log(binsData)

var x = d3.scaleLinear()
    .domain(dataExtent)
    .rangeRound([0, width]);

var maxNumber = d3.max(binsData, function(d) { 
  return d.length; 
});
var y = d3.scaleLinear()
    .domain([0, maxNumber])
    .range([height, 0]);

var bar = g.selectAll(".bar")
  .data(binsData)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { 
      return "translate(" 
        + x(d.x0) + "," + y(d.length) 
        + ")"; 
    });

bar.append("rect")
    .attr("x", 0.5)
    .attr("fill", "steelblue")
    .attr("width", function(d) {
      return x(d.x1) - x(d.x0) - 1;
    })
    .attr("height", function(d) { 
      return height - y(d.length); 
    });

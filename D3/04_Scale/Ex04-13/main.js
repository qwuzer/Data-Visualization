xScale = d3.scaleLinear()
            .domain([0, 4030954])
            .range([0, 400]);

var axis = d3.axisBottom(xScale);
// var axis = d3.axisLeft(xScale);
// var axis = d3.axisRight(xScale);
// var axis = d3.axisTop(xScale);
d3.select('svg')
  .append('g')
  .attr("transform", "translate(100, 100)")
  .call(axis);






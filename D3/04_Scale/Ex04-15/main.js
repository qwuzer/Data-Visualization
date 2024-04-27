xScale = d3.scaleLinear()
            .domain([0, 4030954])
            .range([0, 400]);

// var axis = d3.axisBottom(xScale)
//               .tickSize(50);
var axis = d3.axisBottom(xScale)
              .tickSizeInner(50);
var axis = d3.axisBottom(xScale)
              .tickSizeOuter(50);
d3.select('svg')
  .append('g')
  .attr("transform", "translate(100, 100)")
  .call(axis);






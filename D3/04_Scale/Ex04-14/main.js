xScale = d3.scaleLinear()
            .domain([0, 4030954])
            .range([0, 400]);

var axis = d3.axisBottom(xScale)
              .ticks(5);
// var axis = d3.axisBottom(xScale)
//              .tickFormat(function(d){
//                return (d/1000000)+"M";
//              });
// var axis = d3.axisBottom(xScale)
//               .tickValues([500000, 2500000, 3500000]);

d3.select('svg')
  .append('g')
  .attr("transform", "translate(100, 100)")
  .call(axis);






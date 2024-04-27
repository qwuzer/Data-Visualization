var width = 500;
var height = 160;

var cities = [
              { name: 'London', population: 8674000},
              { name: 'New York', population: 8406000},
              { name: 'Sydney', population: 4293000},
              { name: 'Paris', population: 2244000},
              { name: 'Beijing', population: 11510000}
            ];

var svg = d3.select("svg");
var fontSize = 18;


var cityNames = cities.map(function(d) {return d.name});
var bandScale = d3.scaleBand()
                  .domain(cityNames)
                  .range([0, height])
                  .paddingOuter(0.33)
                  .paddingInner(0.33);

var pop2width = d3.scaleLinear()
                  .domain([0, 1.2*1e7])
                  .range([0, width]);

var barChartG = svg.append('g')
                    .attr('id', 'bar-chart');

var tip = d3.tip()
            .attr('class', 'd3-tip')
            .html(d=>(d.name + ": " + d.population));

barChartG.call(tip);

var texts = barChartG.append('g')
                    .selectAll('text')
                    .data(cities)
                    .enter().append("text")
                    .attr('x', 0)
                    .attr('y', function(d, i) {
                      return bandScale(d.name);
                    })
                    .attr('font-size', fontSize)
                    // set anchor and alignment for texts
                    .attr('text-anchor', 'start')
                    .attr('alignment-baseline', 'hanging')
                    .text(function(d) {
                      return d.name;
                    });

var rects =  barChartG.selectAll("rect")
                      .data(cities)
                      .enter().append("rect")
                      .attr("x", 80)
                      .attr("y", function(d) {
                        return bandScale(d.name);
                      })
                      .attr("width", function(d, i) { 
                        return pop2width(d.population);
                      })
                      .attr("height", bandScale.bandwidth())
                      .style("fill", "black");
      
rects.on('mouseover', tip.show)
     .on('mouseout', tip.hide);



 
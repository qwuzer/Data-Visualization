var svg = d3.select("svg");
var margin = {top: 20, right: 20, bottom: 30, left: 50};
var width = +svg.attr("width") - margin.left - margin.right;
var height = +svg.attr("height") - 200 - margin.top - margin.bottom;

var g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var random = d3.randomNormal();
var points = d3.range(1000).map(function() {
    return {
      x: random(), 
      y: random(),
      gender: Math.random() > 0.4 ? 1 : 0 //1 indicates male
    };
  });
console.log(points)
var xScale = d3.scaleLinear()
  .domain(
    d3.extent(points, function(d) { 
      return d.x; 
    })
    )
    .rangeRound([0, width]);

var yScale = d3.scaleLinear()
  .domain(
    d3.extent(points, function(d) { 
      return d.y; 
    })
    )
    .rangeRound([height, 0]);

var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

var circleG = g.append('g');
var circles = circleG.selectAll('circle')
    .data(points).enter()
    .append('circle')
    .attr('fill', function(d){
      if(d.gender == 1)return 'steelblue';
      else return 'pink';
    })
    .attr('r', 5)
    .attr('cx', function(d) {
      return xScale(d.x);
    })
    .attr('cy', function(d) {
      return yScale(d.y);
    });

var axisG = g.append('g');
axisG.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

axisG.append("g")
  .call(yAxis);

var brush = d3.brush()
    .extent([[0, 0], [width, height]])
    .on("start", brushed)
    .on("brush", brushed)
    .on("end", endbrushed)
    ;

circleG.call(brush);

var genders = [0, 0];
points.forEach(d => d.gender===1 ? genders[0]++ : genders[1]++);
var barG = svg.append("g")
            .attr("transform", "translate(0," + (height+100) + ")");
var bars = barG.selectAll('rect').data(genders)
                .enter().append('rect')
                .attr("x", 10)
                .attr("y", (d, i)=> i*20)
                .attr("width", (d) => d/2)
                .attr("height", 15);

function brushed() {
  var extent = d3.event.selection;console.log(extent);
  genders = [0,0];
  circles
    .classed("selected", function(d) { 
      selected = xScale(d.x) >= extent[0][0] && 
                xScale(d.x) <= extent[1][0] && 
                yScale(d.y) >= extent[0][1] && 
                yScale(d.y) <= extent[1][1];
      if( selected && d.gender === 1) genders[0]++;
      else if(selected && d.gender === 0) genders[1]++;
      return selected;
    });
}

function endbrushed() {
  bars.data(genders).attr("x", 10)
                    .attr("y", (d, i)=> i*20)
                    .attr("width", (d) => d/2)
                    .attr("height", 15);
}


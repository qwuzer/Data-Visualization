var data = [
  [{'hour': 0, 'temperature': 21},  {'hour': 3, 'temperature': 17},
  {'hour': 6, 'temperature': 20},  {'hour': 9, 'temperature': 21},
  {'hour': 12, 'temperature': 22}, {'hour': 15, 'temperature': 24},
  {'hour': 18, 'temperature': 20}, {'hour': 21, 'temperature': 17},
  {'hour': 24, 'temperature': 16}],
  
  [{'hour': 0, 'temperature': 17},  {'hour': 3, 'temperature': 20},
  {'hour': 6, 'temperature': 25},  {'hour': 9, 'temperature': 26},
  {'hour': 12, 'temperature': 20}, {'hour': 15, 'temperature': 18},
  {'hour': 18, 'temperature': 17}, {'hour': 21, 'temperature': 15},
  {'hour': 24, 'temperature': 14}]
];


const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
            .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
            .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
       .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

var xScale = d3.scaleLinear()
               .domain([0, 24])
               .range([0, WIDTH]);

console.log(d3.extent(data, d=>d3.extent(d, d.temperature)) )               
var yScale = d3.scaleLinear()
               .domain([13, 28])
               .range([HEIGHT, 0]);

g.append("g")
  .attr("transform", "translate(0," + HEIGHT + ")")
  .call(d3.axisBottom(xScale));

g.append("g")
    .call(d3.axisLeft(yScale));               

var lineGenerator = d3.line()
                      .x(d=>xScale(d.hour))
                      .y(d=>yScale(d.temperature));

g.selectAll(".line")
  .data(data)
  .enter().append("path")
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2)
  .attr("d", d=>lineGenerator(d))

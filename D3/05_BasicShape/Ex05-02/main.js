var data = [
  {'hour': 0, 'temperature': 21},
  {'hour': 3, 'temperature': 17},
  {'hour': 6, 'temperature': 20},
  {'hour': 9, 'temperature': 21},
  {'hour': 12, 'temperature': 22},
  {'hour': 15, 'temperature': 24},
  {'hour': 18, 'temperature': 20},
  {'hour': 21, 'temperature': 17},
  {'hour': 24, 'temperature': 16},
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
               .domain(d3.extent(data, d=>d.hour))
               .range([0, WIDTH]);

var yScale = d3.scaleLinear()
               .domain(d3.extent(data, d=>d.temperature))
               .range([HEIGHT, 0]);

g.append("g")
  .attr("transform", "translate(0," + HEIGHT + ")")
  .call(d3.axisBottom(xScale));

g.append("g")
    .call(d3.axisLeft(yScale));               

var lineGenerator = d3.line()
                      .x(d=>xScale(d.hour))
                      .y(d=>yScale(d.temperature));

g.append("path")
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 2)
  .attr("d", lineGenerator(data));
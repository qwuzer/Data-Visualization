var cities = [
  {name: "Taipei" , population: 2602418},
  {name: "NewTaipei" , population: 4030954},
  {name: "Taoyuan" , population: 2268807},
  {name: "Taichung" , population: 2820787},
  {name: "Tainan" , population: 1874917},
  {name: "Kaohsiung" , population: 2765932},
];

const FWith = 600, FHeight = 400;
const FLeftTopX = 50, FLeftTopY = 80;
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 }
const WIDTH = FWith - (MARGIN.LEFT + MARGIN.RIGHT)
const HEIGHT = FHeight - (MARGIN.TOP + MARGIN.BOTTOM)

const svg = d3.select("#chart-area").append("svg")
            .attr("width", 2000)
            .attr("height", 2000)

const g = svg.append("g")
            .attr("transform", `translate(${FLeftTopX + MARGIN.LEFT}, ${FLeftTopY + MARGIN.TOP})`)

// X label
g.append("text")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 70)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("City")

// Y label
g.append("text")
  .attr("x", -(HEIGHT / 2))
  .attr("y", -40)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Population")

// X ticks
const x = d3.scaleBand()
  .domain(cities.map(d => d.name))
  .range([0, WIDTH])
  .paddingInner(0.3)
  .paddingOuter(0.2)

const xAxisCall = d3.axisBottom(x)
g.append("g")
  .attr("transform", `translate(0, ${HEIGHT})`)
  .call(xAxisCall)
  .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)")

// Y ticks
const y = d3.scaleLinear()
  .domain([0, d3.max(cities, d => d.population)])
  .range([HEIGHT, 0])

const yAxisCall = d3.axisLeft(y)
                    .ticks(3)
                    .tickFormat(d => (d/1000000) + "m")
g.append("g").call(yAxisCall)

const rects = g.selectAll("rect").data(cities)

rects.enter().append("rect")
  .attr("y", d => y(d.population))
  .attr("x", (d) => x(d.name))
  .attr("width", x.bandwidth)
  .attr("height", d => HEIGHT - y(d.population))
  .attr("fill", "grey")



var count = 0;
var years = ['1956', '1966', '1980', '1990', '2000', '2010'];
d3.csv("cityPopulation.csv").then(drawPopulation);

function drawPopulation(cities) {
      const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 }
      const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
      const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

      const svg = d3.select("#chart-area").append("svg")
                  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
                  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

      const g = svg.append("g")
                  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

      // X label
      g.append("text")
            .attr("x", WIDTH / 2)
            .attr("y", HEIGHT + 70)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .text("City")

      // Y label
      g.append("text")
            .attr("x", - (HEIGHT / 2))
            .attr("y", -40)
            .attr("font-size", "20px")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Population")

      // X ticks
      const x = d3.scaleBand()
                  .domain(cities.map(d => d['City']))
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
            .domain([0, d3.max(cities, d => d['2010'])])
            .range([HEIGHT, 0])

      const yAxisCall = d3.axisLeft(y)
                              .ticks(3)
                              .tickFormat(d => (d/1000000) + "m")
      var yaxis = g.append("g").call(yAxisCall)

      var rects = g.selectAll("rect").data(cities);
      
      var r = rects.enter().append("rect")
                  .attr("y", d => y(d[years[count]]))
                  .attr("x", (d) => x(d['City']))
                  .attr("width", x.bandwidth)
                  .attr("height", d => HEIGHT - y(d[years[count]]))
                  .attr("fill", "grey");

      years.forEach(function(year, i){
            var t= d3.transition()
                        .delay(1000*i)
                        .duration(1000);

            r.transition(t)
                  .attr("y", d => y(d[year]))
                  .attr("height", d => HEIGHT - y(d[year]));
      })
}


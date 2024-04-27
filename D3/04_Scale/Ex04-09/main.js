var value2Color = d3.scaleOrdinal();
var texts = "we are learning scale function in d3 for data visualization".split(/ /);
value2Color.domain(texts);
value2Color.range(d3.schemeDark2);

d3.select("svg").selectAll("text").data(texts)
                .enter()
                .append("text")
                .attr("x", 50)
                .attr("y", (d,i)=>((i+1)*30))
                .attr("stroke", (d)=>value2Color(d))
                .text((d)=>d);

  
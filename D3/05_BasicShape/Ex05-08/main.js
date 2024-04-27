var symbolGenerator = d3.symbol()
                        .size(180)
                        .type(d3.symbolStar);
                        // .type(d3.symbolCross);
                        // .type(d3.symbolDiamond);
                        // .type(d3.symbolSquare);
                        // .type(d3.symbolCircle);
                        // .type(d3.symbolTriangle);
                        // .type(d3.symbolWye);

const svg = d3.select("#chart-area")
              .append("svg")
              .attr('width', 600).attr('height', 600)
              .append('path')
              .attr("transform", "translate(100,100)")
              .attr('d', symbolGenerator())

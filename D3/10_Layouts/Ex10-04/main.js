var data = [
  [10, 20, 30],
  [40, 60, 80],
  [100, 200, 300]
];

var chordGenerator = d3.chord()
  .padAngle(0.04);
var chords = chordGenerator(data);


var ribbonGenerator = d3.ribbon()
  .radius(200);

d3.select('g')
  .selectAll('path')
  .data(chords)
  .enter()
  .append('path')
  .attr('opacity', 0.5)
  .attr('stroke', 'blue')
  .attr('d', ribbonGenerator);
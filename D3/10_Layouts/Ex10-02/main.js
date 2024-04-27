var data = [
  {day: 'Mon', apricots: 120, blueberries: 180, cherries: 100},
  {day: 'Tue', apricots: 60, blueberries: 185, cherries: 105},
  {day: 'Wed', apricots: 100, blueberries: 215, cherries: 110},
  {day: 'Thu', apricots: 80, blueberries: 230, cherries: 105},
  {day: 'Fri', apricots: 120, blueberries: 240, cherries: 105}
];

// The colors of apricots, blueberries, and cherries
var colors = ['#FBB65B', '#513551', '#de3163'];

var stackGenerator = d3.stack()
  .keys(['apricots', 'blueberries', 'cherries']);

var stackData = stackGenerator(data);
// console.log(stackData)

// Create a g element for each series/layer
var g = d3.select('svg')
  .selectAll('g')
  .data(stackData)
  .enter().append('g')
  .attr('fill', function(d, i) {
    return colors[i];
  });

// For each series/layer create a rect 
//element for each day
g.selectAll('rect')
  .data(function(d) {
    return d;
  })
  .enter().append('rect')
  .attr('x', function(d, i) {
    return i * 100;
  })
  .attr('y', function(d) {
    return d[0];
  })
  .attr('width', 99)
  .attr('height', function(d) {
    return d[1] - d[0];
  });
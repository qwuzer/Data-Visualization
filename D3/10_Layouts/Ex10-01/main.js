var fruits = [
  {name: 'Apple', quantity: 20},
  {name: 'Banana', quantity: 40},
  {name: 'Cheery', quantity: 50},
  {name: 'Damson', quantity: 10},
  {name: 'Elderberry', quantity: 30}
];
var pieGenerator = d3.pie()
                     .value(
                       function(d){return d.quantity}
                     );
                     //.sort(function(a,b){return a.name.localeCompare(b.name)})
var arcData = pieGenerator(fruits);
//console.log(arcData);
var arcGenerator = d3.arc()
  .innerRadius(20)
  .outerRadius(100);

d3.select('g')
  .selectAll('path')
  .data(arcData)
  .enter()
  .append('path')
  .attr('fill', 'orange')
  .attr('stroke', 'white')
  .attr('d', arcGenerator);

d3.select('g')
  .selectAll('text')
  .data(arcData)
  .enter()
  .append('text')
  .each(function(d) {
    var centroid = arcGenerator.centroid(d);
    d3.select(this)
      .attr('x', centroid[0])
      .attr('y', centroid[1])
      .attr('dx', '-2.0em')
      .text(d.data.name);
  });
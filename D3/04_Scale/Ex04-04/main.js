var dateToWidth = d3.scaleTime()
                    .domain([new Date(2016, 0, 1), new Date(2017, 0, 1)])
                    .range([0, 600]);
console.log(dateToWidth( new Date(2016, 6, 1)));
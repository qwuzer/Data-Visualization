const isoToNumberMapping = {
    'ILA': 1, 'HSQ': 2, 'MIA': 3, 'CHA': 4, 'NAN': 5, 'YUN': 6,
    'CYQ': 7, 'PIF': 8, 'TTT': 9, 'HUA': 10, 'KEE': 11, 'HSZ': 12,
    'CYI': 13, 'TPE': 14, 'KHH': 15, 'TPQ': 16, 'TXG': 17, 'TNN': 18,
    'TAO': 19
};

// Define the dimensions and margins for the whole svg
const margin = { top: 30, right: 30, bottom: 60, left: 60 };
const width = 1500 - margin.left - margin.right;
const height = 900 - margin.top - margin.bottom;

// Append an SVG element to body
const svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    
// Load the CSV data
d3.csv("data_loc.csv").then(function(data) {
    // Convert age values to integers
    let patientCountsByLocation = {};
    data.forEach(function(d) {
        d.Age = Number(d.Age);
        d.Education = Number(d.Education);
        d.MMSE = Number(d.MMSE);
        d.location = Number(d.location);
        d['Hb-A1C'] = Math.min(12, Math.max(5, Number(d['Hb-A1C'])));
        const locationISO = Object.keys(isoToNumberMapping).find(key => isoToNumberMapping[key] === d.location);
        if (locationISO) {
            patientCountsByLocation[locationISO] = (patientCountsByLocation[locationISO] || 0) + 1;
        } else {
            console.error('Location code not found in mapping:', d.location);
        }
    });

/**==================================================Histogram================================================================ */
    // Histogram settings
    let barTotalWidth = 1000, barTotalHeight = 200;
    let barMargin = { top: 10, right: 30, bottom: 30, left: 100 },
        barWidth = barTotalWidth - barMargin.left - barMargin.right,
        barHeight = barTotalHeight - barMargin.top - barMargin.bottom;

    // Define the x-axis and y-axis scales
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Age)])
        .range([0, barWidth]);
    
    // Assuming you want to find the maximum count for setting the y-axis domain
    // // const maxCount = d3.max(counts);
    
    // const yScale = d3.scaleLinear()
    //     .domain([0, maxCount])
    //     .range([barHeight, 0]);


    // Create a histogram generator

    const histogram = d3.histogram()
        .value(d => d.Age)
        .domain(xScale.domain())
        .thresholds(d3.range(0, xScale.domain()[1] + 1, 1));  // Adjust binWidth if needed

    // Generate the histogram data
    const bins = histogram(data);

    // // Define the y-axis scale
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, d => d.length)])
        .nice()
        .range([barHeight, 0]);
    
    // Append axes to SVG
    var axisG = g.append("g");
    axisG.append("g")    
        .attr("transform", `translate(0, ${barHeight})`)
        .call(d3.axisBottom(xScale));
    axisG.append("g")
        .call(d3.axisLeft(yScale));

    // Group for the bars
    var rectG = g.append('g');

    //add labels and title
    g.append("text")
        .attr("class", "bar-title")
        .attr("y" , 0 )
        .attr("x" , barWidth / 2)
        .attr("dy", "-1em")
        .style("text-anchor", "middle")
        .text("Age Distribution");

    g.append("text")
        .attr("x", barWidth / 2)
        .attr("y", barTotalHeight)
        .style("text-anchor", "middle")
        .text("Age");

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -barHeight / 2)
        .attr("y", -margin.left)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Frequency");


    // const bins = histogram(data);

    // Update the bars
    const rects = rectG.selectAll("rect")
        .data(bins, d => d.x0);  // Use a key function for object constancy

    rects.enter().append("rect")
        .attr("x", d => xScale(d.x0))
        .attr("width", d => xScale(d.x1) - xScale(d.x0))
        .attr("fill", "steelblue")
        .merge(rects)
        .attr("y", d => yScale(d.length))
        .attr("height", d => barHeight - yScale(d.length));
        

    var brush = d3.brushX()
        .extent([[0, 0], [barWidth, barHeight]])
        .on("end", brushed);

    rectG.call(brush);

    var filteredData = data;

    function brushed(event) {
        var extent = event.selection;
        if (extent) {
            const minAge = xScale.invert(extent[0]);
            const maxAge = xScale.invert(extent[1]);
            filteredData = data.filter(d => d.Age >= minAge && d.Age <= maxAge);
            
            // Update class for each bar
            rectG.selectAll("rect").each(function(d) {
                var bar = d3.select(this);
                var isBrushed = extent[0] <= xScale(d.x0) && xScale(d.x1) <= extent[1];
                bar.classed("selected", isBrushed)
                   .classed("non-selected", !isBrushed);
            });


            
        } else {
            // Reset if the selection is cleared
            rectG.selectAll("rect").classed("selected", false).classed("non-selected", false);
            filteredData = data;
        }
        
        processDataAndUpdateDonutChart(filteredData);
        updateScatterPlot(filteredData);
    }

    function updateBarChart(filteredData) {
        // Use d3.rollup to count occurrences of each age in the filtered data
        const ageCounts = d3.rollup(filteredData, v => v.length, d => d.Age);
    
        // Extract the counts and ages into separate arrays
        const ages = Array.from(ageCounts.keys());
        const counts = Array.from(ageCounts.values());
        console.log(counts);
    
        // Update the x-axis domain based on the filtered data
        xScale.domain([0, d3.max(filteredData, d => d.Age)]);
    
        // Update the y-axis domain based on the maximum count
        const maxCount = d3.max(counts);
        yScale.domain([0, maxCount]);
    
        // Recalculate the histogram bins with the updated xScale domain
        const bins = histogram(filteredData);
    
        // Update the bars for the original distribution
        const originalRects = rectG.selectAll(".original-rect")
            .data(bins, d => d.x0);
    
        originalRects.enter().append("rect")
            .attr("class", "original-rect")
            .attr("x", d => xScale(d.x0))
            .attr("width", d => xScale(d.x1) - xScale(d.x0))
            .attr("y", 0)
            .attr("height", barHeight)
            .attr("stroke", "steelblue")
            .attr("fill", "none");
    
        originalRects.exit().remove();
    
        // Update the bars for the brushed area
        const brushedRects = rectG.selectAll(".brushed-rect")
            .data(bins, d => d.x0);
    
        brushedRects.enter().append("rect")
            .attr("class", "brushed-rect")
            .attr("x", d => xScale(d.x0))
            .attr("width", d => xScale(d.x1) - xScale(d.x0))
            .attr("y", d => yScale(ageCounts.get(d.x0) || 0))
            .attr("height", d => barHeight - yScale(ageCounts.get(d.x0) || 0))
            .attr("fill", "steelblue");
    
        brushedRects.merge(brushedRects)
            .transition()
            .duration(500)
            .attr("y", d => yScale(ageCounts.get(d.x0) || 0))
            .attr("height", d => barHeight - yScale(ageCounts.get(d.x0) || 0));
    
        brushedRects.exit().remove();
    
        // Update the brush with the new x-axis extent
        rectG.call(brush.extent([[0, 0], [barWidth, barHeight]]));
    
        // Reset the brush selection when clicking on empty space
        rectG.on("click", function () {
            rectG.call(brush.move, null);
        });
    }
    

    
/**====================================================test update donut=============================================================== */

    filteredData.forEach( function(d) {
        if (d.Education === 0) {
            d.EducationLevel = 'NO';
        } else if (d.Education <= 6) {
            d.EducationLevel = 'Elementary';
        } else if (d.Education <= 9) {
            d.EducationLevel = 'Junior High';
        } else if (d.Education <= 12) {
            d.EducationLevel = 'Senior High';
        } else {
            d.EducationLevel = 'College+';
        }
    });

    // Constants and initial data setup
    const educationOrder = ["NO", "Elementary", "Junior High", "Senior High", "College+"];

    // Dimensions for the donut chart
    const donutTotalWidth = 200, donutTotalHeight = 200;
    const donutMargin = { top: 10, right: 30, bottom: 10, left: 10 },
        donutWidth = donutTotalWidth - donutMargin.left - donutMargin.right,
        donutHeight = donutTotalHeight - donutMargin.top - donutMargin.bottom;
    const donutRadius = Math.min(donutWidth, donutHeight) / 2;

    // Create SVG elements
    const donutG = g.append("g")
        .attr("transform", `translate(${barTotalWidth}, 100)`);
    const legendBar = g.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${barTotalWidth + donutWidth}, 20)`);

    // Pie generator, color scale, and arc generator
    const pie = d3.pie().sort(null).value(d => d.value.length);
    const color = d3.scaleOrdinal().domain(educationOrder).range(d3.schemeCategory10);
    const arcGenerator = d3.arc().innerRadius(donutRadius * 0.6).outerRadius(donutRadius);

    // Initialize the donut chart
    initializeDonutChart(filteredData);

    // Initialize the legend
    initializeLegend();

    function initializeDonutChart(filteredData) {
        processDataAndUpdateDonutChart(filteredData);
        donutG.append("text")
            .attr("class", "donut-title")
            .attr("y" , -donutRadius - 10)
            .attr("dy", "-1em")
            .style("text-anchor", "middle")
            .text("Education");
    }
    
    function processDataAndUpdateDonutChart(data) {
        // Process and group data
        const groupedData = d3.group(data, d => d.EducationLevel);
        console.log("Grouped Data:", groupedData); // Check the grouped data
        
        const orderedGroupedData = educationOrder.map(level => {
            return { key: level, value: groupedData.get(level) || [] };
        });
    
        // Update donut chart with processed data
        // console.log(pie(orderedGroupedData))
        updateDonutChart(pie(orderedGroupedData));
    }
    
    function updateDonutChart(pieData) {
        const arcs = donutG.selectAll(".donut-arc")
            .data(pieData, d => d.data.key);
        
        arcs.enter().append("path")
            .attr("class", "donut-arc")
            .attr("fill", d => color(d.data.key))
            .merge(arcs)
            .transition().duration(1000)
            .attrTween("d", function(d) {
                const interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return t => arcGenerator(interpolate(t));
            });

    
        arcs.exit().remove();
    }

    function initializeLegend() {
        const legendData = educationOrder.map(level => ({ label: level, color: color(level) }));
    
        legendBar.selectAll("rect")
            .data(legendData)
            .enter().append("rect")
            .attr("width", 18).attr("height", 18)
            .attr("fill", d => d.color)
            .attr("y", (d, i) => i * 22)
            .on("click", function(event, d) { onLegendClick(d.label); });
    
        legendBar.selectAll("text")
            .data(legendData)
            .enter().append("text")
            .attr("x", 24).attr("y", (d, i) => i * 22 + 9)
            .text(d => d.label);
    }

    var currentSelectedLevel = null;

    function onLegendClick(educationLevel) {
        currentSelectedLevel = currentSelectedLevel === educationLevel ? null : educationLevel;

        const updatedData = currentSelectedLevel ? data.filter(d => d.EducationLevel === currentSelectedLevel) : data;
        processDataAndUpdateDonutChart(updatedData);
        updateLegendStyle();
        filteredData = updatedData;
        console.log(filteredData);
        updateBarChart(updatedData); 
        updateScatterPlot(updatedData);
    }


    function updateLegendStyle() {
        legendBar.selectAll("rect")
            .attr("opacity", d => currentSelectedLevel === null || d.label === currentSelectedLevel ? 1 : 0.5);

        legendBar.selectAll("text")
            .attr("opacity", d => currentSelectedLevel === null || d.label === currentSelectedLevel ? 1 : 0.5);
    }

    // Bind click event to legend items
    legendBar.selectAll("rect, text")
        .on("click", function(event, d) {
            onLegendClick(d.label);
        });
    
// /**================================================================================================================================== */
    // Define the dimensions and margins for the scatter plot
    const scatterMargin = { top: 30, right: 30, bottom: 60, left: 0 };
    const scatterWidth = 700 - scatterMargin.left - scatterMargin.right;
    const scatterHeight = 600 - scatterMargin.top - scatterMargin.bottom;

    //  create group for scatter plot
    const scatterSvg = g.append("g")
        .attr("width", scatterWidth + scatterMargin.left + scatterMargin.right)
        .attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom)
        .attr("transform", `translate(${scatterMargin.left} , ${barTotalHeight + 50} )`);
    
    // Initialize the scales and axes once
    const ScatterxScale = d3.scaleLinear().range([0, scatterWidth]);
    const ScatteryScale = d3.scaleLinear().range([scatterHeight, 0]);

    const xAxis = scatterSvg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${scatterHeight})`);

    const yAxis = scatterSvg.append("g")
        .attr("class", "y-axis");

       
    updateScatterPlot(filteredData);
    function updateScatterPlot(filteredData) {
       
        const ScatterData = d3.group(filteredData, (d) => `${d.Age}_${d.MMSE}`);
        
        // Calculate the size and average 'Hb-A1C' for each group
        const scatterData = Array.from(ScatterData, ([key, values]) => {
            const ageMMSE = key.split('_');
            const age = Number(ageMMSE[0]);
            const mmse = Number(ageMMSE[1]);
            const size = values.length;
            const avgHbA1C =
            d3.mean(values, (d) => d['Hb-A1C']);
            return { age, mmse, size, avgHbA1C };
        });


        ScatterxScale.domain([d3.min(scatterData, d => d.age), d3.max(scatterData, d => d.age)]);
        ScatteryScale.domain([d3.min(scatterData, d => d.mmse), d3.max(scatterData, d => d.mmse)]);


        
        scatterSvg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${scatterHeight})`)
            .transition()
            .call(d3.axisBottom(ScatterxScale))
        
        scatterSvg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(ScatteryScale));

        const circles = scatterSvg.selectAll("circle")
            .data(scatterData, d => d.key);  // Assuming each datum has a unique 'key' property

        // Remove circles that are no longer needed
        circles.exit().remove();

        // Create new circles
        circles.enter()
            .append("circle")
            // .merge(circles)  // Merge new circles with existing ones
            // .transition().duration(1000)
            .attr("cx", d => ScatterxScale(d.age))
            .attr("cy", d => ScatteryScale(d.mmse))
            .attr("r", d => d.size)
            .attr("fill", d => d3.interpolateRdYlBu(d.avgHbA1C / 12))
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .style("fill-opacity", 0.7)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout);

            // Function to show the tooltip
        function mouseover(event, d) {
            d3.select("#scatterTooltip")
                .style("opacity", 1)
                .html("Average Hb-A1C: " + d.avgHbA1C + "<br>Number of Patients: " + d.size +
                    "<br>Average MMSE: " + d.mmse + "<br>Age: " + d.age)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        }

        // Function to update the tooltip's position
        function mousemove(event, d) {
            d3.select("#scatterTooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        }

        // Function to hide the tooltip
        function mouseout(event, d) {
            d3.select("#scatterTooltip")
                .style("opacity", 0);
        }
    }
    // Add labels
    scatterSvg.append("text")
        .attr("x", scatterWidth / 2)
        .attr("y", scatterHeight + 40)
        .style("text-anchor", "middle")
        .text("Age");

    scatterSvg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -scatterHeight / 2)
        .attr("y", -30)
        .style("text-anchor", "middle")
        .text("MMSE");

    // Add a title for the scatter plot
    scatterSvg.append("text")
        .attr("x", scatterWidth / 2)
        .attr("y", -10)
        .style("text-anchor", "middle")
        .text("Age-MMSE-HbA1C (Size : patient count)");


    // Create a legend
    const legend = scatterSvg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${scatterWidth + 20}, ${scatterMargin.top})`); // Adjust the transform

    legend.selectAll("rect")
        .data(d3.range(5, 13))
        .enter()
        .append("rect")
        .attr("x", 0) // Set x to 0 to stack rectangles vertically
        .attr("y", (d, i) => i * 15) // Adjust the y position to stack vertically
        .attr("width", 20)
        .attr("height", 10)
        .attr("fill", (d) => d3.interpolateRdYlBu(d / 12));

    legend.selectAll("text")
        .data(d3.range(5, 13))
        .enter()
        .append("text")
        .attr("x", 25) // Set x to 25 to place text to the right of the rectangles
        .attr("y", (d, i) => i * 15 + 10) // Adjust the y position for text
        .style("text-anchor", "start") // Align text to the left
        .text((d) => d);

    // Add legend label
    legend.append("text")
        .attr("x", 40)
        .attr("y", -10)
        .style("text-anchor", "end")
        .text("Hb-A1C");
    
/**================================================================================================================================== */
    // /* create a scatter plot */

   // Define the dimensions and margins for the scatter plot
    // const scatterMargin = { top: 30, right: 30, bottom: 60, left: 0 };
    // const scatterWidth = 700 - scatterMargin.left - scatterMargin.right;
    // const scatterHeight = 600 - scatterMargin.top - scatterMargin.bottom;

    // Append an SVG element to the body
    // const scatterSvg = g.append("g")
    //             .attr("width", scatterWidth + scatterMargin.left + scatterMargin.right)
    //             .attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom)
    //             .attr("transform", `translate(${scatterMargin.left} , ${barTotalHeight + 50} )`);

    // // Create scales for X and Y axes
    // const ScatterxScale = d3.scaleLinear()
    //     .domain([d3.min(scatterData, (d) => d.age), d3.max(scatterData, (d) => d.age)])
    //     .range([0, scatterWidth]);

    // const ScatteryScale = d3.scaleLinear()
    //     .domain([d3.min(scatterData, (d) => d.mmse) , d3.max(scatterData, (d) => d.mmse) ])
    //     .range([scatterHeight, 0]);

    // // Create X and Y axes
    // const ScatterxAxis = d3.axisBottom(ScatterxScale);
    // const ScatteryAxis = d3.axisLeft(ScatteryScale);

    // scatterSvg.append("g")
    //     .attr("transform", `translate(0, ${scatterHeight})`)
    //     .call(ScatterxAxis);

    // scatterSvg.append("g")
    //     .call(ScatteryAxis);

    // // Create circles for each group in the scatter plot
    // scatterSvg.selectAll("circle")
    //     .data(scatterData)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", (d) => ScatterxScale(d.age))
    //     .attr("cy", (d) => ScatteryScale(d.mmse))
    //     .attr("r", (d) => d.size)
    //     .attr("fill", (d) => d3.interpolateRdYlBu(d.avgHbA1C / 12)) // Use color scale
    //     .attr("stroke", "black")
    //     .attr("stroke-width", 1)
    //     .style("fill-opacity", 0.7)
    //     .on("mouseover", mouseover)
    //     .on("mousemove", mousemove)
    //     .on("mouseout", mouseout);

    // // Add labels
    // scatterSvg.append("text")
    //     .attr("x", scatterWidth / 2)
    //     .attr("y", scatterHeight + 40)
    //     .style("text-anchor", "middle")
    //     .text("Age");

    // scatterSvg.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("x", -scatterHeight / 2)
    //     .attr("y", -30)
    //     .style("text-anchor", "middle")
    //     .text("MMSE");

    // // Add a title for the scatter plot
    // scatterSvg.append("text")
    //     .attr("x", scatterWidth / 2)
    //     .attr("y", -10)
    //     .style("text-anchor", "middle")
    //     .text("Age-MMSE-HbA1C (Size : patient count)");


    // // Create a legend
    // // const legend = scatterSvg.append("g")
    // //     .attr("class", "legend")
    // //     .attr("transform", `translate(${scatterWidth + 20}, ${scatterMargin.top})`); // Adjust the transform

    // legend.selectAll("rect")
    //     .data(d3.range(5, 13))
    //     .enter()
    //     .append("rect")
    //     .attr("x", 0) // Set x to 0 to stack rectangles vertically
    //     .attr("y", (d, i) => i * 15) // Adjust the y position to stack vertically
    //     .attr("width", 20)
    //     .attr("height", 10)
    //     .attr("fill", (d) => d3.interpolateRdYlBu(d / 12));

    // legend.selectAll("text")
    //     .data(d3.range(5, 13))
    //     .enter()
    //     .append("text")
    //     .attr("x", 25) // Set x to 25 to place text to the right of the rectangles
    //     .attr("y", (d, i) => i * 15 + 10) // Adjust the y position for text
    //     .style("text-anchor", "start") // Align text to the left
    //     .text((d) => d);

    // // Add legend label
    // legend.append("text")
    //     .attr("x", 40)
    //     .attr("y", -10)
    //     .style("text-anchor", "end")
    //     .text("Hb-A1C");

    // // Function to show the tooltip
    // function mouseover(event, d) {
    //     d3.select("#scatterTooltip")
    //         .style("opacity", 1)
    //         .html("Average Hb-A1C: " + d.avgHbA1C + "<br>Number of Patients: " + d.size +
    //             "<br>Average MMSE: " + d.mmse + "<br>Age: " + d.age)
    //         .style("left", (event.pageX + 10) + "px")
    //         .style("top", (event.pageY - 28) + "px");
    // }

    // // Function to update the tooltip's position
    // function mousemove(event, d) {
    //     d3.select("#scatterTooltip")
    //         .style("left", (event.pageX + 10) + "px")
    //         .style("top", (event.pageY - 28) + "px");
    // }

    // // Function to hide the tooltip
    // function mouseout(event, d) {
    //     d3.select("#scatterTooltip")
    //         .style("opacity", 0);
    // }



/**================================================================================================================================== */
    /*map of sample count*/
    const colorScale = d3.scaleSequential(d3.interpolateViridis)
        .domain([d3.min(Object.values(patientCountsByLocation)), d3.max(Object.values(patientCountsByLocation))]);
    

    let mapLeft = 1000, mapTop = 0;
    let mapTotalWidth = 1200, mapTotalHeight = 800;
    let mapMargin = { top: 10, right: 10, bottom: 30, left: 10 },
        mapWidth = mapTotalWidth - mapMargin.left - mapMargin.right,
        mapHeight = mapTotalHeight - mapMargin.top - mapMargin.bottom;


    d3.json("taiwan.json").then(function (taiwanData) {
        // Create a projection for the map
        const projection = d3.geoMercator()
            .fitExtent([[0, 0], [mapWidth, mapHeight]], taiwanData);

        // Create a path generator
        const geoGenerator = d3.geoPath()
            .projection(projection);

        // Append an SVG element to the body
        const gMap = g.append("g")
            .attr("transform", `translate(${scatterWidth * 3 /4},${donutHeight + 50})`);

        // Track the currently selected city/county
        let selectedLocation = null;

        // Normalize sample counts
        const sampleCounts = Object.values(patientCountsByLocation);
        const maxCount = Math.max(...sampleCounts);
        const minCount = Math.min(...sampleCounts);

        function onLocationClick(event, d) {
            // Check if 'd' or 'd.properties' is undefined or null
            if (!d || !d.properties) {
                console.error("Invalid data element:", d);
                return; // Exit the function if data is invalid
            }
        
            const locationISO = d.properties.ISO3166;
            if (selectedLocation === locationISO) {
                // Reset selection
                selectedLocation = null;
            } else {
                // New selection
                selectedLocation = locationISO;
            }
        
            // Update the map
            gMap.selectAll("path")
                .attr("fill", function (d) {
                    // Check for invalid data again
                    if (!d || !d.properties) {
                        return "none"; // Provide a default color if data is invalid
                    }
                    const currentLocationISO = d.properties.ISO3166;
                    const patientCount = patientCountsByLocation[currentLocationISO] || 0;
                    const normalizedCount = (patientCount - minCount) / (maxCount - minCount);
        
                    // Apply red color only to the selected location
                    return selectedLocation === currentLocationISO ? 'red' : colorScale(normalizedCount);
                });
        }

        gMap.selectAll("path")
            .data(taiwanData.features)
            .enter().append("path")
            .attr('stroke', "white")
            .attr("d", geoGenerator)
            .attr("fill", function (d) {
                // Get the ISO3166 code for the current location
                const locationISO = d.properties.ISO3166;
                const patientCount = patientCountsByLocation[locationISO] || 0;
                return colorScale(patientCount);   
            })
            .on("click", onLocationClick);
            

        // Add a title for the map
        gMap.append("text")
            .attr("x", mapWidth / 2)
            .attr("y", mapMargin.top)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Sample Count Map");
        const legend = gMap.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${mapWidth/2 + 200},0)`);

        //set the color scale for the legend
        const legendScale = d3.scaleLinear()
            .domain(colorScale.domain())
            .range([0, 200]);

        //  add the color bar
        legend.selectAll("rect")
            .data(d3.range(legendScale.domain()[0], legendScale.domain()[1], 0.1))
            .enter().append("rect")
            .attr("x", 0)
            .attr("y", d => legendScale(d))
            .attr("width", 20)
            .attr("height", (legendScale.domain()[1] - legendScale.domain()[0]) / 200) 
            .attr("fill", d => colorScale(d));

        // add the axis for the color bar
        const legendAxis = d3.axisRight(legendScale)
            .ticks(15); // adjust ticks based on the height of the color bar

        legend.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(20, 0)") // adjust the position of the axis
            .call(legendAxis);

        // add the label for the color bar
        legend.append("text")
            .attr("x", 0)
            .attr("y", -10)
            .attr("text-anchor", "left")
            .style("font-size", "12px")
            .text("Population");

    });

});

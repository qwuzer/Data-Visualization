const svg = d3.select("body").append("svg")
                .attr("width", 2000)
                .attr("height", 2000)

let isBrushed, isClicked = 0;
let minAge = 0;
let maxAge = 100;
let currentSelectedLevel = null;

Initializtion_Data();
function Initializtion_Data()
{
  d3.csv("data_loc.csv").then(function(data) {
        Initialize(data);
  });
}

function UpDateData()
{
    d3.csv("data_loc.csv").then(function(data) 
    {
        let filteredData = data;
        const x = d3.scaleLinear()
            .domain([0, 100])
            .range([0, barWidth])
        if (isBrushed) 
        {
            filteredData = data.filter(d => d.Age >= minAge && d.Age <= maxAge);            
        }




        if( isClicked ){
            data.forEach( function(d) {
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
            if( currentSelectedLevel ){
                filteredData = filteredData.filter(d => d.EducationLevel === currentSelectedLevel);
            }
        }


        console.log("Filtered Data:", filteredData); // Check the filtered data
        Initialize(filteredData);


    });
}


function Initialize(data)
{
    let ageCounts = {};
    let ageData = [];
    data.forEach(function(d) {
        let age = +d.Age;
        if (ageCounts[age]) {
            ageCounts[age]++;
        } else {
            ageCounts[age] = 1;
        }
    });
    for (let age in ageCounts) {
      ageData.push({ age: +age, count: ageCounts[age] });
    }

    let educationCounts = {};
    for(let i=0 ; i<5 ; i++)
    {
        educationCounts[i]=0;
    }
    data.forEach(function(d) 
    {
        let education = +d.Education;
        let education_level
        if(education==0){
            education_level=0
        }
        else if(education<=6){
            education_level=1;
        }
        else if(education<=9){
            education_level=2;
        }
        else if(education<=12){
            education_level=3;
        }
        else{
            education_level=4;
        }
        educationCounts[education_level]++;
    });

    let educationData = [];
    for (let label in educationCounts) 
    {
        educationData.push({ label: +label, count: educationCounts[label] });
    }


    drawBarChart( ageData , data );
    drawPieChart( educationData , data );
}

//-----------------------------------------BAR CHART------------------------------------------//
//-----------------------------------------BAR CHART------------------------------------------//
//-----------------------------------------BAR CHART------------------------------------------//
//Bar settings
let barTotalWidth = 1000, barTotalHeight = 300;
let barMargin = { top : 30, right : 30, bottom : 100, left : 30 },
    barWidth = barTotalWidth - barMargin.left - barMargin.right,
    barHeight = barTotalHeight - barMargin.top - barMargin.bottom;

//APPEND SVG
const gBar = svg.append("g")
                 .attr("transform", `translate(${barMargin.left}, ${barMargin.top})`)

function drawBarChart( filteredAgeData , data ){
    d3.csv("data_loc.csv").then(function(data){
        data.forEach( function(d) {
            d.Age = Number(d.Age);
        });
        
        let ageCounts = {};
        let ageData = [];
        data.forEach( function(d) {
            if (ageCounts[d.Age] === undefined) {
                ageCounts[d.Age] = 1;
            } else {
                ageCounts[d.Age] += 1;
            }
        });
        for (let age in ageCounts) {
            ageData.push({age: age, count: ageCounts[age]});
        }
        const maxCount = d3.max(ageData, d => d.count);

        // Title
        gBar.append("text")
            .attr("x", barWidth / 2)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .text("Age Distribution")

        // X label
        gBar.append("text")
            .attr("x", barWidth / 2)
            .attr("y", barHeight + 70)
            .attr("text-anchor", "middle")
            .text("Age")

        // Y label
        gBar.append("text")
            .attr("x", -(barHeight / 2))
            .attr("y", -barMargin.left)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Count")

        // X ticks
        const x = d3.scaleLinear()
                    .domain([0, d3.max(ageData, d => d.age)])
                    .range([0, barWidth])
        const xAxisCall = d3.axisBottom(x)
        gBar.append("g")
            .attr("transform", `translate(0, ${barHeight})`)
            .call(xAxisCall)
            .selectAll("text")
            .attr("y", "10")
            .attr("x", "-5")
            .attr("text-anchor", "middle")

        // Y ticks
        const y = d3.scaleLinear()
                    .domain([0, maxCount])
                    .range([barHeight, 0])
        const yAxisCall = d3.axisLeft(y)
        gBar.append("g").call(yAxisCall)

        // Bars
        var rectG = gBar.append("g");
        var rects = rectG.selectAll("rect").data(ageData)
                            .enter().append("rect")
                            .attr("class" , "bar")
                            .attr("y", d => y(d.count))
                            .attr("x", d => x(d.age))
                            .attr("width", 10)
                            .attr("height", d => barHeight - y(d.count))
                            .attr("fill", "steelblue")
                            .attr("stroke", "black");

        // Brush
        var brush = d3.brushX()
                .extent([[0, 0], [barWidth, barHeight]])
                .on("end", brushed);

        gBar.call(brush);

        function brushed(event) {
            var extent = event.selection;
            if (extent) {
                isBrushed = 1;
                minAge = x.invert(extent[0]);
                maxAge = x.invert(extent[1]);
                // filteredData = data.filter(d => d.Age >= minAge && d.Age <= maxAge);
                UpDateData();
            } else {
                isBrushed = 0;
                UpDateData();
            }
        }         
        
        if( JSON.stringify(ageData) !== JSON.stringify(filteredAgeData)){
            rects.attr("fill","white")
            rectsnew = gBar.selectAll("bar_rect")
                .data(filteredAgeData)
                .enter().append("rect")
                .attr("class","bar")
                .attr("y", d => y(d.count))
                .attr("x", d => x(d.age))
                .attr("width", 10)
                .attr("height",0)
                .attr("height", d => barHeight - y(d.count))
                .attr("stroke", "black")
                .attr("fill", "steelblue")
        
        }

    });
}

//-----------------------------------------PIE CHART------------------------------------------//
//-----------------------------------------PIE CHART------------------------------------------//
//-----------------------------------------PIE CHART------------------------------------------//

let pieLeft = 1200 , pieTop = 100;
const pieTotalWidth = 200, pieTotalHeight = 200;
// let pieTotalWidth = 1000, pieTotalHeight = 400;
let pieMargin = {top:10,right:30,bottom:30,left:100},
    pieWidth = pieTotalWidth - pieMargin.left - pieMargin.right,
    pieHeight = pieTotalHeight - pieMargin.top - pieMargin.bottom;
const pieRadius = Math.min(pieWidth, pieHeight) / 2;


const gPie = svg.append("g")
                .attr("transform", `translate(${barTotalWidth}, ${pieTop})`)

const legendBar = svg.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${barTotalWidth + pieWidth + 100}, 20)`);

const educationOrder = ["NO", "Elementary", "Junior High", "Senior High", "College+"];

function drawPieChart( educationData,data ) {
    d3.csv("data_loc.csv").then(function(data){
        data.forEach( function(d) {
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

        // Pie generator, color scale, and arc generator
        const pie = d3.pie().sort(null).value(d => d.value.length);
        const color = d3.scaleOrdinal().domain(educationOrder).range(d3.schemeCategory10);
        const arcGenerator = d3.arc().innerRadius(pieRadius * 0.6).outerRadius(pieRadius);

        const groupedData = d3.group(data, d => d.EducationLevel);
        console.log("Grouped Data:", groupedData); // Check the grouped data
            
        const orderedGroupedData = educationOrder.map(level => {
            return { key: level, value: groupedData.get(level) || [] };
        });

        updateDonutChart(pie(orderedGroupedData));

        function updateDonutChart(pieData) {
            const arcs = gPie.selectAll(".donut-arc")
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

        gPie.append("text")
            .attr("class", "donut-title")
            .attr("y" , -pieRadius - 10)
            .attr("dy", "-1em")
            .style("text-anchor", "middle")
            .text("Education");
    
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
        
    
        function onLegendClick(educationLevel) {
            currentSelectedLevel = currentSelectedLevel === educationLevel ? null : educationLevel;
            console.log("Current selected level:", currentSelectedLevel);
            const updatedData = currentSelectedLevel ? data.filter(d => d.EducationLevel === currentSelectedLevel) : data;
            updateLegendStyle();
            filteredData = updatedData;
            isClicked = 1;
            UpDateData();
            console.log(filteredData);
        }
    
    
        function updateLegendStyle() {
            legendBar.selectAll("rect")
                .attr("opacity", d => currentSelectedLevel === null || d.label === currentSelectedLevel ? 1 : 0.5);
        }
    
        // Bind click event to legend items
        legendBar.selectAll("rect, text")
            .on("click", function(event, d) {
                onLegendClick(d.label);
            });
    });

}
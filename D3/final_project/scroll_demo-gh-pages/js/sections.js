
/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var scrollVis = function () {
  // constants to define the size
  // and margins of the vis area.
  var width = 700;
  var height = 520;
  var margin = { top: 10, left: 50, bottom: 40, right: 10 };
  var plotWidth = width - margin.left - margin.right;
  var plotHeight = height - margin.bottom - margin.top;

  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.
  var lastIndex = -1;
  var activeIndex = 0;

  // main svg used for visualization
  var svg = null;

  // When scrolling to a new section
  // the activation function for that
  // section is called.
  var activateFunctions = [];
  // If a section has an update function
  // then it is called while scrolling
  // through the section with the current
  // progress through the section.
  var updateFunctions = [];

  /**
   * chart
   *
   * @param selection - the current d3 selection(s)
   *  to draw the visualization in. For this
   *  example, we will be drawing it in #vis
   */
  var chart = function (selection) {
    selection.each(function (rawData) {
      svg = d3.select(this).append('svg').attr('width', width).attr('height', height);
      setupVis(rawData);
      setupSections();
    });
  };


  /**
   * setupVis - creates initial elements for all
   * sections of the visualization.
   *
   * @param wordData - data object for each word.
   * @param fillerCounts - nested data that includes
   *  element for each filler word type.
   * @param histData - binned histogram data
   */
  var setupVis = function (rawData) {
      ///////************* Data Processing ****************/
      uselessData = rawData['data1'];
      baseBallData = rawData['data2'];
      //////// baseball data process
      baseBallData.forEach(function(d){
        d.H = Number(d.H);
        d.AB = Number(d.AB);
        d['2B'] = Number(d['2B']);
        d['3B'] = Number(d['3B']);
        d['HR'] = Number(d['HR']);
        d.SB = Number(d.SB);
        d.BB = Number(d.BB);
        d.GIDP = Number(d.GIDP);
        d.CS = Number(d.CS);
        d.HR = Number(d.HR);
        d.G = Number(d.G);
        d.salary = Number(d.salary);
      });

      let bbData = baseBallData.filter( (d) => d.AB > 25 );
      
      //data for salary
      let parData = bbData.map((d) => (
              {
              "BA": d.H/d.AB, 
              "OC": d['SO']/d.AB,
              "Salary": d.salary,
              "teamID": d.teamID,
              "nameFirst": d.nameFirst,
              "nameLast": d.nameLast}
          ));

      baExtent = d3.extent(parData, d=>d.BA);
      ocExtent = d3.extent(parData, d=>d.OC);
      

      //////************** create visualization as usual, set every <g> to fully transparent */

      //**** baseball title - bTitleG contains everything about the "title"
      bTitleG = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      bTitleG.style('opacity', 0);
      bTitleG.append('text')
        .attr('class', 'title baseballTitle')
        .attr('x', width / 2)
        .attr('y', height / 3)
        .text('2020');
  
      bTitleG.append('text')
        .attr('class', 'sub-title baseballTitle')
        .attr('x', width / 2)
        .attr('y', (height / 3) + (height / 5))
        .text('DV Baseball');
  

    //**** baseball scatter plot - scatterPlotG contains everything about the scatter Plot
    scatterPlotG = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    scatterPlotG.style('opacity', 0);
    
    var scatterX = d3.scaleLinear()
                .domain([0, baExtent[1]])
                .range([ 0, plotWidth ]);
    scatterPlotG.append("text").attr("x", plotWidth/2).attr("y", plotHeight+30)
                        .attr("font-size", "12px")
                        .text("H/AB");
    scatterPlotG.append('g').attr("transform", "translate(0," + plotHeight + ")").call(d3.axisBottom(scatterX));
          
    var scatterY = d3.scaleLinear()
                .domain([0, ocExtent[1]])
                .range([ plotHeight, 0]);
    scatterPlotG.append('g').call(d3.axisLeft(scatterY));
    scatterPlotG.append("text").attr("x", -40).attr("y", plotHeight/2)
                    .attr("font-size", "10px")
                    .attr("transform", "rotate(-90, -40, " + plotHeight/2 + ")")
                    .text("SO/AB")
            
    let circleG = scatterPlotG.append('g');
    circles = circleG.append('g').selectAll("circle")
                .data(parData)
                .enter()
                .append("circle")
                    .attr("cx", function (d) { return scatterX(d.BA); } )
                    .attr("cy", function (d) { return scatterY(d.OC); } )
                    .attr("r", 2.5)
                    .attr("opacity", 0.6)
                    .attr("stroke", "black")
                    .attr("stroke-width", 0)
                    .attr("fill", "#69b3a2");
    
    tip = d3.tip().attr('class', 'd3-tip').html(d=>(d.teamID + "<br>" + d.nameFirst + " " + d.nameLast + "<br> Salary: " + d.Salary));
    circleG.call(tip);


    //**** baseball bar chart - barChartG contains everything about the bar chart
    barChartG = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    barChartG.style('opacity', 0);

    teamCount = parData.reduce((accumulator, currentValue) => {
      if(accumulator[currentValue.teamID]) {
          accumulator[currentValue.teamID] ++;
        } else {
          accumulator[currentValue.teamID] = 1;
        }
      return accumulator;
      }, {});

    teamCountAry = Object.keys(teamCount).map(d=>({"team": d, "count": teamCount[d]}));
    teamCountExtent = d3.extent(teamCountAry, d=>d.count);

    xUnsorted = d3.scaleBand().domain(teamCountAry.map(d=>d.team)).range([0, plotWidth]).paddingInner(0.3).paddingOuter(0.2);

    teamCountAryBk = Object.keys(teamCount).map(d=>({"team": d, "count": teamCount[d]}));
    teamCountAryBk.sort((a, b)=>b.count - a.count);
    newXaxisArray = teamCountAryBk.map(d=>d.team);
    xSorted = d3.scaleBand().domain(newXaxisArray).range([0, plotWidth]).paddingInner(0.3).paddingOuter(0.2);
    
 
    var y = d3.scaleLinear().domain([0, teamCountExtent[1]]).range([plotHeight, 0]);
    barChartG.append("g")
        .attr("transform", "translate(0,0)")
            .call(d3.axisLeft(y).ticks(5));
    barChartG.append("text").attr("x", plotWidth/2).attr("y", plotHeight+margin.bottom -5 )
            .attr("font-size", "12px")
            .text("team")
    barChartG.append("text").attr("x", -40).attr("y", plotHeight/2+30)
                .attr("font-size", "10px")
                .attr("transform", "rotate(-90, -40, " + (plotHeight/2+30) + ")")
                .text("Number of players")
    barChartXAxisG = barChartG.append("g").attr("transform", "translate(" + 0 + "," + plotHeight + ")")
                .call(d3.axisBottom(xUnsorted));
                
    barChartG.selectAll("rect")
        .data(teamCountAry)
        .enter().append("rect")
        .attr("x", d=>xUnsorted(d.team))
        .attr("y", d=>y(d.count))
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("fill", "none")
        .attr("width", xUnsorted.bandwidth)
        .attr("height", d=>plotHeight - y(d.count))
        .classed("outerBar", true);


  };

  /**
   * setupSections - each section is activated
   * by a separate function. Here we associate
   * these functions to the sections based on
   * the section's index.
   *
   */
  var setupSections = function () {
    var numberOfFunctions = 4;
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = showBaseballTitle;
    activateFunctions[1] = showScatterPlot;
    activateFunctions[2] = showBarChartPlot;
    activateFunctions[3] = showSortedBarChartPlot;

    // updateFunctions are called while
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
    for (var i = 0; i < numberOfFunctions; i++) {
      updateFunctions[i] = function () {};
    }
  };

  /**
   * ACTIVATE FUNCTIONS
   *
   * These will be called their
   * section is scrolled to.
   *
   * General pattern is to ensure
   * all content for the current section
   * is transitioned in, while hiding
   * the content for the previous section
   * as well as the next section (as the
   * user may be scrolling up or down).
   *
   */

  function showBaseballTitle(){
    scatterPlotG.transition().duration(200).style('opacity', 0);

    bTitleG.transition().duration(200).style('opacity', 1);
    circles.on('mouseover', null).on('mouseout', null);
  }

  function showScatterPlot(){
    bTitleG.transition().duration(200).style('opacity', 0);
    barChartG.transition().duration(200).style('opacity', 0);
    scatterPlotG.transition().duration(200).style('opacity', 1);
    circles.on('mouseover', tip.show).on('mouseout', tip.hide);
  }

  function showBarChartPlot(){
    scatterPlotG.transition().duration(200).style('opacity', 0);
    barChartG.transition().duration(200).style('opacity', 1);
    barChartXAxisG.transition().duration(500).call(d3.axisBottom(xUnsorted));
    barChartG.selectAll('rect').transition().duration(500).attr('x', d=>xUnsorted(d.team));
    circles.on('mouseover', null).on('mouseout', null);
  }

  function showSortedBarChartPlot(){
    barChartXAxisG.transition().duration(500).call(d3.axisBottom(xSorted));
    barChartG.selectAll('rect').transition().duration(500).attr('x', d=>xSorted(d.team));
  }

  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  chart.activate = function (index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  /**
   * update
   *
   * @param index
   * @param progress
   */
  chart.update = function (index, progress) {
    updateFunctions[index](progress);
  };

  // return chart function
  return chart;
};


/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
 function display(error, data1, data2) {
   cData = {'data1': data1, 'data2':data2}
  // create a new plot and
  // display it
  var plot = scrollVis();
  d3.select('#vis')
    .datum(cData)
    .call(plot);

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  // setup event handling
  scroll.on('active', function (index) {
    // highlight current step text
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

    // activate current section
    plot.activate(index);
  });

  scroll.on('progress', function (index, progress) {
    plot.update(index, progress);
  });
}



// load data and display
d3.queue().defer(d3.tsv, "data/words.tsv")
          .defer(d3.csv, "data/players.csv")
          .await(display)

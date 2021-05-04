
const svgWidth = 960;
const svgHeight = 500;


const margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};


const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight + 40); // extra padding for third label


// Append an SVG group
const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// set the path for csv
const path = "assets/data/data.csv";


// read the data from csv to plot scatter plot
d3.csv(path).then(function(stateData){
    // console.log("Overall data ", stateData);

    stateData.forEach(function(data){
        data.smokes = +data.smokes;
        data.age = +data.age;
    });


    // build xLinearScale
    var xLinearScale = d3.scaleLinear()
        .range([0, width])
        .domain(d3.extent(stateData, data=> data.age));

    // build yLinearScale
    var yLinearScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(stateData, data => data.smokes)]);

    // build axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // plot the chart with axis
    chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);
    chartGroup.append("g").call(leftAxis);

    // plot the circles
    chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", "10")
        .attr("fill", "rgb(52, 184, 217)")
        .attr("opacity", "0.5");

    // get the abbr on circles
    chartGroup.append("g")
        .selectAll("text")
        .data(stateData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("dx", d => xLinearScale(d.age))
        .attr("dy", d => yLinearScale(d.smokes))
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "10px")
        .attr("alignment-baseline", "central");

    // get amoker on y axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .style("font-weight", "bold")
        .text("% Smoker");

    // get avergae age on x axis
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .classed("active", true)
        .style("font-weight", "bold")
        .text("Average Age");

})

.catch(function (error) {
    console.log(error);
});
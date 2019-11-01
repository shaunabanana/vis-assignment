var dataset = null;
var xMin = 0;  // Max of dataset X axis
var yMin = 0;  // Max of dataset Y axis

/*
var scatterWidth = + d3.select('div.vis div.scatter').style('width').slice(0, -2);
var scatterHeight = + d3.select('div.vis div.scatter').style('height').slice(0, -2);
*/

var graphWidth = + d3.select('div.vis').style('width').slice(0, -2);
var graphHeight = + d3.select('div.vis').style('height').slice(0, -2);

var xScale = 1; // xScale = graphWidth / xRange
var yScale = 1;

// Controlls the spacing between points and axis
var pointSize = 6.5;
var spacingMultiplier = 4;

// Define colors and axis here.
var colors = [];
var xAttribute = 'Birth Rate';
var yAttribute = 'Death Rate';



function pointTop(d) {
    var top = yMin + yRange;
    top = (+d[yAttribute] - yMin) * yScale + pointSize;
    top = scatterHeight - top;
    return top + 'px'
}

function pointLeft(d) {
    var left = (+d[xAttribute] - xMin) * xScale + pointSize;
    return left + 'px'
}

function drawAxis(xAxis, yAxis) {    

    d3.select('div.vis svg.axis')
        .append('g')
        .attr("transform", "translate(" + (graphWidth - scatterWidth - pointSize * spacingMultiplier / 2) + "," + (scatterHeight + pointSize * spacingMultiplier / 2) + ")") 
        .call(d3.axisBottom(xAxis))

    var yAxisElement = d3.select('div.vis svg.axis')
        .append('g');

    yAxisElement.attr("transform", "translate(" + 
        (graphWidth - scatterWidth - pointSize * spacingMultiplier / 2)
        + ", -" + 
        0 + ")") 
        .call(d3.axisLeft(yAxis));

}


d3.csv('countries_of_world.csv').then(function (data) {
    dataset = data;

    xMin = axisMin(dataset, xAttribute);
    yMin = axisMin(dataset, yAttribute);

    xRange = axisRange(dataset, xAttribute);
    yRange = axisRange(dataset, yAttribute);

    xScale = (scatterWidth - pointSize * 2) / xRange;
    yScale = (scatterHeight - pointSize * 2) / yRange;

    var xExtension = (scatterWidth + pointSize * spacingMultiplier) / scatterWidth * axisRange(dataset, xAttribute)
    xExtension -= axisRange(dataset, xAttribute);
    xExtension /= 2;

    var yExtension = (scatterHeight + pointSize * spacingMultiplier) / scatterHeight * axisRange(dataset, yAttribute)
    yExtension -= axisRange(dataset, yAttribute);
    yExtension /= 2;

    var xAxis = d3.scaleLinear()
        .domain([ axisMin(dataset, xAttribute) - xExtension , axisMax(dataset, xAttribute) + xExtension])
        .range([0, scatterWidth + pointSize * spacingMultiplier]);

    var yAxis = d3.scaleLinear()
        .domain([ axisMin(dataset, yAttribute) - yExtension , axisMax(dataset, yAttribute) - yExtension ])
        .range([scatterHeight + pointSize * spacingMultiplier / 2, 0]);

    var circles = d3.select('div.vis div.scatter').selectAll('div.circle')
    //var circles = d3.select('div.vis svg.axis').selectAll('div.circle')
    
    circles.data(dataset)
        .enter()
        .append('div')
        .attr('class', 'circle')
        .style('top', pointTop)
        .style('left', pointLeft)

    drawAxis(xAxis, yAxis);

})
// Make the dataset global
var dataset = null;
// Selectors
var vis = d3.select('div.vis');
var graph = d3.select('div.vis .graph');
var legends = d3.select('div.vis .legends');
var tooltip = d3.select('.tooltip');
// Graph sizes
var visWidth = + vis.style('width').slice(0, -2);
var visHeight = + vis.style('height').slice(0, -2);
var graphWidth = + graph.style('width').slice(0, -2) - 1;
var graphHeight = + graph.style('height').slice(0, -2) - 1;
// Scales and axes
var xScale, yScale;
var xAxis, yAxis;
// Zoom
var zoom;


d3.csv('countries_of_world.csv').then(function (data) {
    // Save loaded data
    dataset = data;

    // Preprocessing
    dataset = format(dataset);   // Format strings to numbers (for those that are numbers), and strip strings
    dataset = initIds(dataset);     // Initiate IDs for each datapoint
    dataset = setXY(dataset, xAttribute, yAttribute);   // Set attributes

    //Create scales and axes
    xScale = createScale(
        dataset, xAttribute, 
        direction="default",
        maxlen=graphWidth,
        padding=xTransform
    );
    yScale = createScale(
        dataset, yAttribute, 
        direction="reversed",
        maxlen=graphHeight, 
        padding=yTransform
    );
    xAxis = createAxis(d3.axisBottom, xScale, xAttribute);
    yAxis = createAxis(d3.axisLeft, yScale, yAttribute);

    // Define colors
    var color = d3.scaleOrdinal()
        .domain( gatherAxis(dataset, colorBy) )
        .range(d3.schemePastel1);
    
    // Draw 'em!
    populateDropdown(dataset, 'select.x', xAttribute);
    populateDropdown(dataset, 'select.y', yAttribute);
    enableZoom();
    drawCircles(dataset, xScale, yScale, color);
    drawAxes(xAxis, yAxis);
    drawLegends(dataset, color);
})
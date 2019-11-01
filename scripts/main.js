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


// Controls the spacing between points and axis
var spacing = 20;
// Controls the left and bottom margin of the graph
var xTransform = 60;
var yTransform = 20;

// Define colors and axis attributes here.
var colorBy = 'Region';
var tooltipBy = 'Country';
var xAttribute = 'Birth Rate';
var yAttribute = 'Death Rate';





d3.csv('countries_of_world.csv').then(function (data) {
    // Save loaded data
    dataset = data;

    // Preprocessing
    dataset = format(dataset);   // Format strings to numbers (for those that are numbers), and strip strings
    dataset = initIds(dataset);     // Initiate IDs for each datapoint
    dataset = setXY(dataset, xAttribute, yAttribute);   // Set attributes

    //Create scales
    var xScale = createScale(
        dataset, xAttribute, 
        direction="default",
        maxlen=graphWidth,
        padding=xTransform
    );
    var yScale = createScale(
        dataset, yAttribute, 
        direction="reversed",
        maxlen=graphHeight, 
        padding=yTransform
    );
    // Define colors
    var color = d3.scaleOrdinal()
        .domain( gatherAxis(dataset, colorBy) )
        .range(d3.schemePastel1);

    // Enable panning & zooming
    var zoom = d3.zoom()
        .scaleExtent([.5, 20])
        .extent([[xTransform, yTransform], [graphWidth - 120, graphHeight]])
        .on("zoom", function () {
            // Create new scale ojects based on event
            var new_xScale = d3.event.transform.rescaleX(xScale);
            var new_yScale = d3.event.transform.rescaleY(yScale);
            // Update axes
            drawAxes(new_xScale, new_yScale);
            // gX.call(xAxis.scale(new_xScale));
            // gY.call(yAxis.scale(new_yScale));
            graph.selectAll('circle').data(dataset)
                .attr('cx', function(d) {return new_xScale(d.__x)})
                .attr('cy', function(d) {return new_yScale(d.__y)});
        });

    // Draw 'em!

    graph.append("defs").append('clipPath')
        .attr('id', 'clip')
        .append('rect')
            .attr('width', graphWidth)
            .attr('height', graphHeight)
            .attr('transform', 'translate(' + xTransform + ', -' + yTransform + ')')

    graph.append("rect")
        .attr('width', graphWidth)
        .attr('height', graphHeight)
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .attr('transform', 'translate(' + xTransform + ', -' + yTransform + ')')
        .call(zoom);

    populateDropdown(dataset, 'select.x', xAttribute);
    populateDropdown(dataset, 'select.y', yAttribute);
    drawAxes(xScale, yScale);
    drawCircles(dataset, xScale, yScale, color);
    drawLegends(dataset, color);

    
})
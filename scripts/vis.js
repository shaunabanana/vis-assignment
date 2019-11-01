function createScale(dataset, attribute, direction='default', maxlen=0, padding=0) {
    // Calculate graph axis domain with proper spacing
    var extension = (maxlen + spacing * 2) / maxlen * axisRange(dataset, attribute)
    extension -= axisRange(dataset, attribute);
    extension /= 2;
    var min = Math.max( axisMin(dataset, attribute) - extension, 0 )
    // Create axis
    var axis = d3.scaleLinear()
        .domain([ axisMin(dataset, attribute) - extension , axisMax(dataset, attribute) + extension])
        //.domain([ Math.max( axisMin(dataset, attribute) - extension, 0 ) , axisMax(dataset, attribute) + extension])
        .range(direction == 'default' ? [padding, maxlen] : [maxlen, padding]);
    return axis;
}


function drawAxes(xAxis, yAxis) {
    graph.append('g')
        .attr('class', 'axis y')
        .attr('transform', 'translate(' + xTransform + ", -" + yTransform + ')')
        .call( yAxis );
    graph.append('g')
        .attr('class', 'axis x')
        .attr('transform', 'translate(0, ' + (graphHeight - yTransform) + ')')
        .call( xAxis );
}


function updateAxes(xAttribute, yAttribute) {
    // Reset zoom level first to prevent problems
    graph.select('rect#zoom').transition().duration(600).call(
        zoom.transform,
        d3.zoomIdentity.translate(0, 0).scale(1)
    ).on('end', function () {
        // Create updated scales and axes
        var new_xScale = createScale(
            dataset, xAttribute, 
            direction="default",
            maxlen=graphWidth,
            padding=xTransform
        );
        var new_yScale = createScale(
            dataset, yAttribute, 
            direction="reversed",
            maxlen=graphHeight, 
            padding=yTransform
        );

        // Animate update of axes
        graph.select('g.axis.x').transition().duration(600).call(xAxis.scale(new_xScale));
        graph.select('g.axis.y').transition().duration(600).call(yAxis.scale(new_yScale));

        // Update data and play animations
        dataset = setXY(dataset, xAttribute, yAttribute);
        graph.selectAll('circle').transition()
            .duration(600)
            .attr('cx', function (d) { return new_xScale(d.__x) } )
            .attr('cy', function (d) { return new_yScale(d.__y) - yTransform })
            .on('end', function() {
                xScale = new_xScale;
                yScale = new_yScale;
                xAxis = d3.axisBottom(new_xScale);
                yAxis = d3.axisLeft(new_yScale);
            })
    })
    
}


function drawCircles(dataset, xScale, yScale, color) {
    graph.append('g').selectAll('circle')
        .data(dataset).enter()
        .append('circle')

        .attr('cx', function (d) { return xScale(d.__x) } )
        .attr('cy', function (d) { return yScale(d.__y) - yTransform })
        .attr('r', 5)
        .attr('stroke', 'black')
        .attr('stroke-width', '1')
        .attr('clip-path', 'url(#clip)')
        .attr('fill', function (d) { return color( d[colorBy] ) })

        .on('mouseover', function () {
            var dot = d3.select(this);
            //enlarge dot
            dot.attr('r', 8);
            dot.attr('stroke-width', '1.5')
            //move tooltip
            tooltip.style('left', dot.attr('cx') + 'px');
            tooltip.style('top', dot.attr('cy') - 10 + 'px');
            tooltip.select('span').text(dot.data()[0][tooltipBy]);
            tooltip.style('display', 'block');
            //change cursor
            graph.style('cursor', 'pointer');
        })
        .on('mouseout', function () {
            var dot = d3.select(this)
            //shrink dot
            dot.attr('r', 5);
            dot.attr('stroke-width', '1')
            //remove tooltip
            tooltip.style('display', 'none')
            //change cursor
            graph.style('cursor', 'default')
        })
}


function drawLegends(dataset, color) {
    var categories = gatherAxisUnique(dataset, colorBy);
    var sel = legends.selectAll('div').data(categories).enter().append('div')
    sel.append('div')
        .attr('class', 'legend-circle')
        .style('background', function (d) { return color(d) });
    sel.append('span').text(function (d) { return d; });
}


function populateDropdown(dataset, selector, attribute) {
    // Obtain numeric keys
    var dropdownItems = [];
    var keys = Object.keys(dataset[0]);
    for (var k in keys) {
        if ( (typeof dataset[0][keys[k]] == 'number') && keys[k].slice(0, 2) != '__' ) {
            dropdownItems.push(keys[k]);
        }
    }

    // Populate axis
    d3.select(selector).selectAll('option').data(dropdownItems).enter()
        .append('option')
        .attr('value', function (d) { return d; })
        .each(function (d) {
            // Set default selection to be current attribute
            if (d == attribute) {
                d3.select(this).attr('selected', true); 
            }
        })
        .text(function (d) { return d; });

    d3.selectAll(selector).on('change', function () {
        xAttribute = d3.select('select.x').property('value');
        yAttribute = d3.select('select.y').property('value');
        d3.select('div.intro p.description span.x').text(xAttribute);
        d3.select('div.intro p.description span.y').text(yAttribute);
        updateAxes(xAttribute, yAttribute);
    })
}


function handleZoom() {
    // Create new scale ojects based on event
    var new_xScale = d3.event.transform.rescaleX(xScale);
    var new_yScale = d3.event.transform.rescaleY(yScale);
    // Update axes
    graph.select('g.axis.x').call(xAxis.scale(new_xScale));
    graph.select('g.axis.y').call(yAxis.scale(new_yScale));

    graph.selectAll('circle').data(dataset)
        .attr('cx', function(d) {return new_xScale(d.__x)})
        .attr('cy', function(d) {return new_yScale(d.__y) - 20});
}


function createZoom() {
    zoom = d3.zoom()
        .scaleExtent([.5, 20])
        .extent([[xTransform, 0], [graphWidth - 120, graphHeight]])
        .on("zoom", handleZoom);
    
    graph.append("defs").append('clipPath')
        .attr('id', 'clip')
        .append('rect')
            .attr('width', graphWidth)
            .attr('height', graphHeight)
            .attr('transform', 'translate(' + xTransform + ', -' + yTransform + ')')

    graph.append("rect")
        .attr('id', 'zoom')
        .attr('width', graphWidth)
        .attr('height', graphHeight)
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .attr('transform', 'translate(' + xTransform + ', -' + yTransform + ')')
        .call(zoom);
}
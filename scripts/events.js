function onCircleMouseOver() {
    var dot = d3.select(this);
    //enlarge dot
    dot.transition().duration(80)
        .attr('r', 8)
        .attr('stroke-width', '1.5');
    //move tooltip
    tooltip.style('left', dot.attr('cx') + 'px');
    tooltip.style('top', dot.attr('cy') - 10 + 'px');
    tooltip.select('span').text(dot.data()[0][tooltipBy]);
    tooltip.style('display', 'block');
    tooltip.transition().duration(80)
        .style('opacity', 1);
    //change cursor
    graph.style('cursor', 'pointer');
}


function onCircleMouseOut() {
    var dot = d3.select(this);
    //shrink dot
    dot.transition().duration(80)
        .attr('r', 5)
        .attr('stroke-width', '1');
    //remove tooltip
    tooltip.transition().duration(80)
        .style('opacity', 0)
        .on('end', function () { tooltip.style('display', 'none'); });
    //change cursor
    graph.style('cursor', 'grab');
}


function onCircleClick() {
    var dot = d3.select(this);
    // Hide dot
    dot.style('display', 'none');
}


function onChangeAxes() {
    xAttribute = d3.select('select.x').property('value');
    yAttribute = d3.select('select.y').property('value');
    // Change intro text
    d3.select('div.intro p.description span.x').text(xAttribute);
    d3.select('div.intro p.description span.y').text(yAttribute);
    updateAxes(xAttribute, yAttribute);
}


function onZoom() {
    // Create new scale ojects based on event
    var new_xScale = d3.event.transform.rescaleX(xScale);
    var new_yScale = d3.event.transform.rescaleY(yScale);
    // Update axes
    graph.select('g.axis.x').call(xAxis.scale(new_xScale));
    graph.select('g.axis.y').call(yAxis.scale(new_yScale));

    graph.selectAll('circle').data(dataset)
        .attr('cx', function(d) {return new_xScale(d.__x)})
        .attr('cy', function(d) {return new_yScale(d.__y) - 20});

    if (d3.event.sourceEvent && d3.event.sourceEvent.type == 'mousemove') {
        graph.style('cursor', 'grabbing');
    }
}

function onZoomEnd() {
    graph.style('cursor', 'grab');
}
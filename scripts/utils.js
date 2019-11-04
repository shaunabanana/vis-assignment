function splitCamelCase(s) {
    return s.replace(/([A-Z])/g, ' $1').trim();
}


function axisMin(dataset, axis) {
    var min = Number.MAX_VALUE;
    for (var i = 0; i < dataset.length; i ++) {
        var value = +dataset[i][axis];
        if (value < min) min = value;
    }
    return min;
}


function axisMax(dataset, axis) {
    var max = Number.MIN_VALUE;
    for (var i = 0; i < dataset.length; i ++) {
        var value = +dataset[i][axis];
        if (value > max) max = value;
    }
    return max;
}


function axisRange(dataset, axis) {
    return axisMax(dataset, axis) - axisMin(dataset, axis);
}


function gatherAxis(dataset, axis) {
    var axisList = [];
    for (var i = 0; i < dataset.length; i ++) {
        axisList.push(dataset[i][axis])
    }
    return axisList;
}


function gatherAxisUnique(dataset, axis) {
    var axisList = [];
    for (var i = 0; i < dataset.length; i ++) {
        if (axisList.filter( function (d) { return d == dataset[i][axis] } ).length == 0) {
            axisList.push(dataset[i][axis])
        }
    }
    return axisList;
}


function format(dataset) {
    var keys = Object.keys(dataset[0]);
    for (var k in keys) {
        if ( !Number.isNaN(+dataset[0][ keys[k] ]) ) {
            for (var i = 0; i < dataset.length; i ++) {
                dataset[i][keys[k]] = +dataset[i][keys[k]];
            }
        } else {
            for (var i = 0; i < dataset.length; i ++) {
                dataset[i][keys[k]] = dataset[i][keys[k]].trim();
            }
        }
    }
    return dataset;
}


function initIds(dataset) {
    for (var i in dataset) {
        dataset[i].__id = i;
    }
    return dataset;
}


function setXY(dataset, xAxis, yAxis) {
    for (var i in dataset) {
        dataset[i].__x = dataset[i][xAxis];
        dataset[i].__y = dataset[i][yAxis];
    }
    return dataset;
}


function getNumericKeys(dataset) {
    var dropdownItems = [];
    var keys = Object.keys(dataset[0]);
    for (var k in keys) {
        if ( !Number.isNaN(dataset[0][keys[k]]) && keys[k].slice(0, 2) != '__' ) {
            dropdownItems.push(keys[k]);
        }
    }
    return dropdownItems;
}
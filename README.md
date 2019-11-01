# vis-assignment
Code for Prof. Cao's "Big Data Analytics and Visualization" course. Visualization of "countries_of_world.csv" using D3.js.

## Running
Start a local server and visit `index.html`.

## Structure
All code are in `scripts` folder. `main.js` is the entry point, while other files provide necessary helper functions.

`vis.js` contains code for visualization. Mostly D3 drawing code.

`utils.js` contains code for data processing.

## TODO
- [ ] Fix bug caused by drawAxes and d3.zoom not sharing the same axis & scale variable.
- [ ] Remove point on click.
- [ ] Show percentage for percentage attributes.

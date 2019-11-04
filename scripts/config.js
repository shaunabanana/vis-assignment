// Controls the spacing between points and axis
var spacing = 20;

// Controls the left and bottom margin of the axes
// Basically how far away the axes should be from the edges of the graph
var xTransform = 65;
var yTransform = 20;

// Define color, tooltip and axis attributes here.
var colorBy = 'Region';
var tooltipBy = 'Country';
var xAttribute = 'Birth Rate';
var yAttribute = 'Death Rate';

// Which columns are supposed to be rendered as percentages
var percentages = ['Birth Rate', 'Death Rate', 'Infant mortality', 'Literacy Rate', 'Agriculture', 'Industry', 'Service'];

// Which columns are already percentages in number, but simply have no % sign after it.
var percentagesAlready = ['Arable land (%)', 'Crops land (%)', 'Other land (%)'];
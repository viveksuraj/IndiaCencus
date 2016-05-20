var width = 900, //width
  height = 900,   //height
  outerRadius = 350,   //radius
  color = d3.scale.category20(); //builtin range of colors

d3.json("outPutFiles/ageWiseLiterateDistribution.json", function(error, data) {
    if(error) console.log(error);
    data.forEach(function(d) {
        d.ageGroup = d.ageGroup;
        d.TotalLiteratePop = d.TotalLiteratePop;
      });

      // var tip = d3.tip()
      //   .attr('class', 'd3-tip')
      //   .offset([-10, 0])
      //   .html(function(d) {
      //     return "<strong>Number of People: </strong> <span style='color:red'>" + d.TotalLiteratePop + "</span>";
      //   });

var vis = d3.select("#chart")

  .append("svg:svg")
    .data([data])
    .attr("width", width) //set the width
    .attr("height", height) //set the height
    .append("svg:g")
    //make a group to hold our pie chart
      .attr("transform", "translate(" + 1.5*outerRadius + "," + 1.5*outerRadius + ")") // relocate center of pie to 'outerRadius,outerRadius'

// This will create <path> elements for us using arc data...
var arc = d3.svg.arc()
  .outerRadius(outerRadius);

var pie = d3.layout.pie() //this will create arc data for us given a list of values
  .value(function(d) { return d.TotalLiteratePop; }) // Binding each value to the pie
  .sort( function(d) { return null; } );

// Select all <g> elements with class slice (there aren't any yet)
var arcs = vis.selectAll("g.slice")
      .data(pie)
      .enter()
  .append("svg:g")

  .attr("class", "slice")
  // .on('mouseover', tip.show)
  // .on('mouseout', tip.hide);

//allow us to style things in the slices (like text)
arcs.append("svg:path")
  //set the color for each slice to be chosen from the color function defined above
  .attr("fill", function(d, i) { return color(i); } )
  //this creates the actual SVG path using the associated data (pie) with the arc drawing function
  .attr("d", arc);

// Add a legendLabel to each arc slice...
arcs.append("svg:text")
  .attr("transform", function(d) {
    d.outerRadius = outerRadius + 50; // Set Outer Coordinate
    d.innerRadius = outerRadius + 45; // Set Inner Coordinate
    return "translate(" + arc.centroid(d) + ")";

  })
  .attr("text-anchor", "middle") //center the text on it's origin
  .style("fill", "Purple")
  .style("font", "bold .8em Arial")
  .text(function(d, i) { return data[i].ageGroup; }); //get the label from our original data array

// Add a magnitude value to the larger arcs, translated to the arc centroid and rotated.
   arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text")
  .attr("dy", ".35em")
  .attr("text-anchor", "middle")
  .attr("transform", function(d)
   {
    d.outerRadius = outerRadius;
    d.innerRadius = outerRadius/2;
    return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
  })
  .style("fill", "White")
  .style("font", "bold 8px Arial")
  .text(function(d) { return d.data.TotalLiteratePop; });

// Computes the angle of an arc, converting from radians to degrees.
function angle(d) {
  var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
  return a > 90 ? a - 180 : a;
}
});

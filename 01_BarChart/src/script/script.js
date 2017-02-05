"use strict";

var description = '';
var margin = {top: 20, right: 150, bottom: 80, left: 150};
var height = 800 - margin.top - margin.bottom;
var width = 1500 - margin.left - margin.right;

// append title
d3.select('body').append('h1')
  .text('Gross Domestic Product')
  .attr('class', 'title');

  //append graph
var svg = d3.select('body').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

var prepareChart = function() {

  //description of the graph
  d3.select('body').append('p')
    .attr('class', 'description')
    .html(description);


  //append svg container
  d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  //append graph
  svg.append('g')
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr('class', 'chart');

};


var displayChart = function(dataSet) {

  prepareChart();

  //display Bars in Chart

  var chartSelector = d3.select('.chart');

  var barSelector = chartSelector.selectAll('.bar');

  // x scale and axis variables

  var barWidth = width / dataSet.length;

  var parseTime = d3.timeParse("%Y-%m-%d");
  var formatInfo = d3.timeFormat("%Y-%B");

  var extentTime = d3.extent(dataSet, function(d) {
    return parseTime(d[0]);
  });

  var scaleTime = d3.scaleTime()
    .domain(extentTime)
    .range([0, width]);

  var xAxis = d3.axisBottom(scaleTime);

  chartSelector.append('g')
    .attr("class", "x-axis")
    .attr("transform", "translate(0,"+height+")")
    .call(xAxis);

  // y scale and axis

  var maxGross = d3.max(dataSet, function(d) {
    return d[1];
  });

  var scaleGross = d3.scaleLinear()
    .domain([0, maxGross])
    .range([height, 0]);

  var yAxis = d3.axisLeft(scaleGross);

  chartSelector.append('g')
    .attr('class', 'y-axis')
    .call(yAxis)
    .append('text')
    .text('Gross Domestic Product, USA')
    .attr('class', 'y-label').attr('transform', 'rotate(-90)')
    .attr('y', 30)
    .attr('x', 0);

  // display info on bar hovering

  var enterBar = barSelector.data(dataSet).enter();

  // construct chart

  enterBar.append('rect')
    .attr('class', 'bar')
    .attr('value', function(d) {return d[1]})
    .attr('width', barWidth)
    .attr('height', function(d){
      return height - scaleGross(d[1]);
    })
    .attr('y', function(d){
      return scaleGross(d[1]);
    })
    .attr('x', function(d){
      return scaleTime(parseTime(d[0]));
    })
    .on("mouseover", function(d){
        infoBar.attr("transform", "translate(" + (scaleTime(parseTime(d[0])) - 75) + "," + (scaleGross(d[1]) - 60 + 0.6*(height - scaleGross(d[1]))) +")");
        infoBar.style("visibility", "visible");
        infoHeader.text('$' + d[1] + ' Billion');
        infoDate.text(formatInfo(parseTime(d[0])));
    })
    .on("mouseout", function() {
        infoBar.style("visibility", "hidden");
    });

  var infoBar =  chartSelector.append('g')
    .attr('class', 'info')
    .style("visibility", "hidden")
    .on("mouseover", function(){infoBar.style("visibility", "visible")});

  var infoBackground = infoBar.append('rect')
    .attr('class','info-background')
    .attr('width', 170)
    .attr('height', 50)
    .attr('rx', 5)
    .attr('ry', 5);

  var infoHeader = infoBar.append('text')
    .attr('class', 'info-header')
    .attr('x', 20)
    .attr('y', 20)
    .text('billion')
    .style("color","black");

  var infoDate = infoBar.append('text')
    .attr('class', 'info-date')
    .attr('x', 20)
    .attr('y', 40)
    .text('date');

};

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', displayChart)
.response(function(response) {
  var result = JSON.parse(response.responseText);
  description = result.description;
  return result.data;
});

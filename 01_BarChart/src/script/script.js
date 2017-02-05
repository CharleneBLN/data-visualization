"use strict";

var margin = {top: 20, right: 200, bottom: 80, left: 200};
var height = 800 - margin.top - margin.bottom;
var width = 1500 - margin.left - margin.right;

var setChart = function(description) {

  var body = d3.select('body');

  // append title
  body.append('h1')
    .text('Gross Domestic Product')
    .attr('class', 'title');

  //append svg container
  body.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  //description of the graph
  body.append('p')
    .attr('class', 'description')
    .html(description);

  //append graph
  d3.select('svg').append('g')
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr('class', 'chart');

};

var setAxis = function(chart, xAxis, yAxis) {

  chart.append('g')
    .attr("class", "x-axis")
    .attr("transform", "translate(0,"+height+")")
    .call(xAxis);

  chart.append('g')
    .attr('class', 'y-axis')
    .call(yAxis)
    .append('text')
    .text('Gross Domestic Product, USA')
    .attr('class', 'y-label').attr('transform', 'rotate(-90)')
    .attr('y', 30)
    .attr('x', 0);
};

var setTooltip = function(chart) {

  var tooltip =  chart.append('g')
    .attr('class', 'tooltip')
    .style("visibility", "hidden")
    .on("mouseover", function(){tooltip.style("visibility", "visible")});

  tooltip.append('rect')
    .attr('class','tooltip-background')
    .attr('width', '10em')
    .attr('height', '2.5em')
    .attr('rx', 5)
    .attr('ry', 5);

  tooltip.append('text')
    .attr('class', 'tooltip-header')
    .attr('x', 20)
    .attr('y', 20)
    .text('billion');

  tooltip.append('text')
    .attr('class', 'tooltip-date')
    .attr('x', 20)
    .attr('y', 40)
    .text('date');
};

var displayData = function(data) {

  setChart(data.description);

  //define selectors
  var svg = d3.select('svg');
  var chart = d3.select('.chart');
  var bar = chart.selectAll('.bar');

  var dataSet = data.data;

  //x data scale
  var parseTime = d3.timeParse("%Y-%m-%d");
  var extentTime = d3.extent(dataSet, function(d) {
    return parseTime(d[0]);
  });
  var scaleTime = d3.scaleTime()
    .domain(extentTime)
    .range([0, width]);

  //y data scale
  var maxGDP = d3.max(dataSet, function(d) {
    return d[1];
  });
  var scaleGDP = d3.scaleLinear()
    .domain([0, maxGDP])
    .range([height, 0]);

  setAxis(chart, d3.axisBottom(scaleTime), d3.axisLeft(scaleGDP));

  var enterBar = bar.data(dataSet).enter();
  var formatInfo = d3.timeFormat("%Y-%B");

  //Enter data

  var createBar = enterBar.append('rect')
    .attr('class', 'bar')
    .attr('value', function(d) {return d[1]})
    .attr('width', width/dataSet.length)
    .attr('height', function(d){
      return height - scaleGDP(d[1]);
    })
    .attr('y', function(d){
      return scaleGDP(d[1]);
    })
    .attr('x', function(d){
      return scaleTime(parseTime(d[0]));
    });

  setTooltip(chart);

  createBar.on("mouseover", function(d){
      d3.select('.tooltip').attr("transform", "translate(" + (scaleTime(parseTime(d[0])) - 75) + "," + (scaleGDP(d[1]) - 60 + 0.6*(height - scaleGDP(d[1]))) +")");
      d3.select('.tooltip').style("visibility", "visible");
      d3.select('.tooltip-header').text('$' + d[1] + ' Billion');
      d3.select('.tooltip-date').text(formatInfo(parseTime(d[0])));
    })
    .on("mouseout", function() {
      d3.select('.tooltip').style("visibility", "hidden");
    });

};

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', displayData)
.response(function(response) {
  return JSON.parse(response.responseText);
});

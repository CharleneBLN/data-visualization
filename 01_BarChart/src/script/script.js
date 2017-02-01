"use strict";

var margin = {top: 20, right: 30, bottom: 30, left: 40};
var height = 600 - margin.top - margin.bottom;
var width = 1200 - margin.left - margin.right;

var prepareChart = function() {

  d3.select('body').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);
  d3.select('svg').append('g')
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr('class', 'chart');

};

var displayChart = function(dataSet) {

  prepareChart();

  //display Bars in Chart

  var chartSelector = d3.select('.chart');

  var barSelector = chartSelector.selectAll('rect');

  // x scale and axis

  var barWidth = width / dataSet.length;

  var parseTime = d3.timeParse("%Y-%m-%d");
  var formatYear = d3.timeFormat("%Y-%m-%d");

  var extentTime = d3.extent(dataSet, function(d) {
    return parseTime(d[0]);
  });

  var scaleTime = d3.scaleLinear()
    .domain(extentTime)
    .range([0, width]);

  var xAxis = d3.axisBottom(scaleTime);

  // y scale and axis

  var extentGross = d3.extent(dataSet, function(d) {
    return d[1];
  });

  var scaleGross = d3.scaleLinear()
    .domain(extentGross)
    .range([height, 0]);

  var yAxis = d3.axisLeft(scaleGross).ticks([10]);

  // construct chart

  var enterBar = barSelector.data(dataSet).enter();

  enterBar.append('rect')
    .attr('width', barWidth)
    .attr('height', function(d){
      return height - scaleGross(d[1]);
    })
    .attr('y', function(d){
      return scaleGross(d[1]);
    })
    .attr('x', function(d){
      return scaleTime(parseTime(d[0]));
    });

  chartSelector.append('g')
    .attr("class", "x-axis")
    .attr("transform", "translate(0,"+height+")")
    .call(xAxis);

  // d3.select(".x-axis").append("g")
  //   .attr("class", "tick")
  //   .call(xTicks);

  //Set Y Axis


  chartSelector.append('g')
    .call(yAxis);

};

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', displayChart)
.response(function(response) {
  var result = JSON.parse(response.responseText);
  return result.data;
});

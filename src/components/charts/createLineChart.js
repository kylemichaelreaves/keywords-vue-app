"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLineChart = void 0;
var d3 = require("d3");
var createLineChart = function (el, summaries) {
    var svgElement = el;
    if (svgElement) {
        d3.select(svgElement).selectAll('*').remove();
    }
    var chartData = summaries.flat().map(function (item) {
        var date;
        if (item.day_number) {
            date = new Date(Number(item.year), Number(item.month_number) - 1, Number(item.day_number));
        }
        else if (item.week_number) {
            date = new Date(Number(item.year), 0, 1); // start with Jan 1
            date.setDate(Number(item.week_number) * 7); // add the number of weeks
        }
        else {
            date = new Date(Number(item.year), Number(item.month_number) - 1, 1);
        }
        return {
            date: date,
            total_debit: item.total_debit,
        };
    });
    var margin = { top: 5, right: 5, bottom: 40, left: 32 };
    var width = 300;
    var height = 150;
    console.log('chartData', chartData);
    var x = d3
        .scaleTime()
        .range([0, width])
        .domain(d3.extent(chartData, function (d) { return d.date; }).reverse());
    console.log('x.domain', x.domain());
    var _a = d3.extent(chartData, function (d) { return d.total_debit; }), minAmount = _a[0], maxAmount = _a[1];
    var y = d3.scaleLinear().range([height, 0]).domain([maxAmount, minAmount]);
    var line = d3
        .line()
        .x(function (d) { return x(d.date); })
        .y(function (d) { return y(d.total_debit); });
    var xAxis = d3.axisBottom(x);
    var yAxis = d3.axisLeft(y);
    var svg = d3
        .select(svgElement)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', "translate(".concat(margin.left, ",").concat(margin.top, ")"));
    svg
        .append('g')
        .attr('class', 'x-axis')
        .attr('transform', "translate(0,".concat(height, ")"))
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.55em') // moved labels slightly down
        .attr('transform', 'rotate(-35)'); // decrease rotation angle
    svg
        .append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .attr('d', line);
    svg.append('g').attr('class', 'y-axis').call(yAxis);
};
exports.createLineChart = createLineChart;

import type {MJSummary, OFSummary} from "@types";
import * as d3 from 'd3';

interface DataPoint {
    date: Date;
    total_debit: number;
}

export const createLineChart = (el: unknown, summaries: (OFSummary | MJSummary)[]) => {
    const svgElement = el as SVGSVGElement;

    if (svgElement) {
        d3.select(svgElement).selectAll('*').remove();
    }

    const chartData = summaries.flat().map((item: OFSummary | MJSummary) => {
        let date;
        if (item.day_number) {
            date = new Date(Number(item.year), Number(item.month_number) - 1, Number(item.day_number));
        } else if (item.week_number) {
            date = new Date(Number(item.year), 0, 1); // start with Jan 1
            date.setDate(Number(item.week_number) * 7); // add the number of weeks
        } else {
            date = new Date(Number(item.year), Number(item.month_number) - 1, 1);
        }
        return {
            date: date,
            total_debit: item.total_debit,
        };
    });


    const margin = {top: 5, right: 5, bottom: 40, left: 32};
    const width = 300;
    const height = 150;

    const x = d3
        .scaleTime()
        .range([0, width])
        .domain(d3.extent(chartData, (d) => d.date) as unknown as [Date, Date]);

    const [minAmount, maxAmount] = d3.extent(chartData, (d) => d.total_debit) as [number, number];

    const y = d3.scaleLinear().range([height, 0]).domain([maxAmount, minAmount]);

    const line = d3
        .line<DataPoint>()
        .x((d) => x(d.date))
        .y((d) => y(d.total_debit));

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    const svg = d3
        .select(svgElement)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    svg
        .append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
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
}
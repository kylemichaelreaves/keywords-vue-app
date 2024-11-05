import type {DailyInterval, MJSummary, OFSummary} from "@types";
import * as d3 from 'd3';
import {useTippy} from "vue-tippy";
import 'tippy.js/animations/scale.css'
import 'tippy.js/themes/translucent.css'


interface DataPoint {
    date: Date;
    total_debit: number;
}

export const createLineChart = (
    el: unknown,
    summaries: (OFSummary | MJSummary | DailyInterval)[],
    onDateSelected: (date: string) => void
) => {
    const svgElement = el as SVGSVGElement;

    // if there's already an SVG element, destroy it utterly
    if (svgElement) {
        d3.select(svgElement).selectAll('*').remove();
    }

    const parentElement = svgElement?.parentElement;
    const parentWidth = parentElement ? parentElement.getBoundingClientRect().width : 300;

    const parseDateUTC = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ');

    const chartData = summaries.flat().map((item: OFSummary | MJSummary | DailyInterval) => {
        const date = item.date
            ? parseDateUTC(<string>item.date)
            : item.day_number
                ? new Date(Number(item.year), Number(item.month_number) - 1, Number(item.day_number))
                : item.week_number
                    ? new Date(Number(item.year), 0, 1 + (Number(item.week_number) - 1) * 7)
                    : new Date(Number(item.year), Number(item.month_number) - 1, 1);

        const total_debit = item.total_amount_debit ? item.total_amount_debit : item.total_debit

        return {
            date: date,
            total_debit: total_debit,
        };
    });

    const margin = {top: 5, right: 32, bottom: 80, left: 32};
    const width = parentWidth - margin.left - margin.right;
    const height = 150;


    const x = d3
        .scaleUtc()
        .range([0, width])
        .domain(d3.extent(chartData, (d) => d.date) as unknown as [Date, Date]);

    const [minAmount, maxAmount] = d3.extent(chartData, (d) => d.total_debit) as [number, number];

    const y = d3.scaleLinear().range([height, 0]).domain([maxAmount, minAmount]);

    const line = d3
        .line<DataPoint>()
        .x((d) => x(d.date))
        .y((d) => y(d.total_debit));

    const formatDate = d3.utcFormat('%Y-%m-%d');

    const xAxis: d3.Axis<Date | number | { valueOf(): number }> = d3.axisBottom(x).tickFormat((domainValue) => {
        return formatDate(domainValue as Date);
    });


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
        .attr('dy', '.55em')
        .attr('transform', 'rotate(-90)');


    svg
        .append<SVGPathElement>('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .attr('d', (d) => line(d) || '');

    svg
        .append('g')
        .attr('class', 'y-axis')
        .call(yAxis);

    svg.selectAll('.dot')
        .data(chartData)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', (d) => x(d.date as Date))
        .attr('cy', (d) => y(d.total_debit as number))
        .attr('r', 4)
        .attr('fill', 'red')
        .on('click', (event, d) => {
            const dateString = d3.utcFormat('%Y-%m-%d')(d.date as Date);
            onDateSelected(dateString);
        })
        .each(function (d) {
            useTippy(this, {
                content: `${d3.utcFormat('%Y-%m-%d')(d.date as Date)}<br>$${d?.total_debit?.toFixed(2)}`,
                allowHTML: true,
                theme: 'translucent',
                placement: 'top-start',
                animation: 'scale',
            });
        });


}

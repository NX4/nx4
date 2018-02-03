import * as d3 from 'd3';

function Context() {
  const margin = { t: 20, r: 20, b: 20, l: 20 };
  let W;
  let H;
  // const dis = d3.dispatch('countTrips');
  let scaleX;
  let scaleY;

  /**
  * exports() returns a new line chart
  * based on the passed-in d3 selection
  */
  function exports(selection) {
    W = W || selection.node().clientWidth - margin.l - margin.r;
    H = H || selection.node().clientHeight - margin.t - margin.b;
    const lineData = selection.datum() ? selection.datum() : [];


    // Scales
    const contextX = d3.scaleLinear();
    const contextY = d3.scaleLinear()
      .domain([0, 2]) // TODO, depends on base of LOG used for entropy
      .range([H, 0]);

    // Axes
    const xAxisContext = d3.axisBottom(contextX);
    const yAxisContext = d3.axisLeft(contextY).ticks(2);

    // Line generator
    const line = d3.line()
      .x((d, i) => contextX(i))
      .y(d => contextY(d.e));

    // SVG initializer
    const svg = selection.selectAll('svg')
      .data([0]);

    const svgEnter = svg.enter()
      .append('svg')
      .attr('width', W + margin.l + margin.r)
      .attr('height', H + margin.t + margin.b)
      .merge(svg)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const brush = d3.brushX()
      .extent([[0, 0], [W, H]])
      .on('end', brushed)
      // .on('brush', brushedForOverview);

    const context = svgEnter.append('g')
      .attr('class', 'mainContext');

    context.append('path')
      .datum(lineData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${H})`)
      .call(xAxisContext);

    context.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxisContext);

    svgEnter.append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, contextX.range());

    console.log('Inside Context');

    return exports;
  } // exports()
} // Context()

export default Context;

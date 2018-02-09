import * as d3 from 'd3';
import actions from '../actions/index';
import { getState, dispatch, observe } from '../store';

function Focus() {
  const margin = { t: 20, r: 20, b: 20, l: 20 };
  let W;
  let H;

  const scaleX = d3.scaleLinear();
  const scaleY = d3.scaleLinear();

  const zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [W, H]])
    .extent([[0, 0], [W, H]])
    .on('zoom', zoomed);

  const bisectPosition = d3.bisector(function (d, i) { return d.i; }).left;

  /**
  * exports() returns a new line chart
  * based on the passed-in d3 selection
  */
  function exports(selection) {
    W = W || selection.node().clientWidth - margin.l - margin.r;
    H = H || selection.node().clientHeight - margin.t - margin.b;
    const lineData = selection.datum() ? selection.datum() : [];

    console.log(lineData);

    // Scales
    scaleX
      .range([0, W])
      .domain([0, lineData.length]);

    console.log(lineData.length);

    scaleY
      .range([H, 0])
      .domain([0, 2]); // TODO, depends on base of LOG used for entropy

    // Axes
    const xAxis = d3.axisBottom(scaleX);
    const yAxis = d3.axisLeft(scaleY).ticks(2);

    // Line generator
    const lines = d3.line()
      .x((d, i) => scaleX(i))
      .y(d => scaleY(d.e))
      .curve(d3.curveStepAfter);

    // Bisecting
    function mouseMove() {
      const x0 = scaleX.invert(d3.mouse(this)[0]);

      // our problem is the bisect function!!
      // TODO FIX
      const i = bisectPosition(lineData, x0, 1, 14000);
      const d0 = lineData[i - 1];
      const d1 = lineData[i];
      const d = x0 - d0.i > d1.i - x0 ? d1 : d0;

      console.log(x0, i, d.e);

      tooltip.select('circle.y')
        .attr('transform',
        'translate(' + scaleX(x0) + ',' +
        scaleY(d.e) + ')');
    }

    // SVG initializer
    const svg = selection.selectAll('svg')
      .data([0]);

    const svgEnter = svg.enter()
      .append('svg')
      .attr('width', W + margin.l + margin.r)
      .attr('height', H + margin.t + margin.b)
      .merge(svg)
      .append('g')
      .attr('transform', `translate(${margin.l}, ${margin.t})`);

    const tooltip = svgEnter.append('g')
      .style('display', 'none');

    tooltip.append('circle')
      .attr('class', 'y')
      .style('fill', 'none')
      .style('stroke', 'blue')
      .attr('r', 4);

    svgEnter.append('defs').append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', W)
      .attr('height', H);

    const focus = svgEnter.append('g')
      .attr('class', 'focus');

    focus.append('path')
      .datum(lineData)
      .attr('class', 'focusPath')
      .attr('id', 'someid')
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1)
      .attr('d', lines);

    focus.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${H})`)
      .call(xAxis);

    focus.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis);

    svgEnter.append('rect')
      .attr('class', 'zoom')
      .attr('width', W)
      .attr('height', H)
      .call(zoom);

    svgEnter.append('rect')
      .attr('width', W)
      .attr('height', H)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => { tooltip.style('display', null); })
      .on('mouseout', () => { tooltip.style('display', 'none'); })
      .on('mousemove', mouseMove);

    const unsubscribe = observe(state => state.focus, (state, nextSate) => {
      const lower = Math.round(state.range[0]);
      const upper = Math.round(state.range[1]);

      scaleX.domain(state.domain);
      d3.select('#someid').attr('d', lines);
      focus.select('.axis--x').call(xAxis);

      // svgEnter.select('.zoom').call(zoom.transform, d3.zoomIdentity
      //   .scale(W / (upper - lower))
      //   .translate(-lower, 0));
    });
  } // exports()

  function zoomed() {
    console.log('zooming from inside a module');
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return; // ignore zoom-by-brush
    const t = d3.event.transform;

    // overviewX.domain(t.rescaleX(x2).domain());
    // overviewtainerSvg.select('overviewPath').attr('d', line);
    // overview.select(".axis--x").call(xAxis);
    // context.select('.brush').call(brush.move, x.range().map(t.invertX, t));
  }

  return exports;
} // Focus()

export default Focus;

import * as d3 from 'd3';
import actions from '../../actions/index';
import { getState, dispatch, observe } from '../../store';

function Context() {
  const margin = { t: 20, r: 20, b: 20, l: 40 };
  let W;
  let H;
  const scaleX = d3.scaleLinear();
  const scaleY = d3.scaleLinear();

  const ticks = scaleY.ticks(2);
  const tickFormat = scaleY.tickFormat('.%');

  /**
  * exports() returns a new line chart
  * based on the passed-in d3 selection
  */
  function exports(selection) {
    W = W || selection.node().clientWidth - margin.l - margin.r;
    H = H || selection.node().clientHeight - margin.t - margin.b;
    const lineData = selection.datum() ? selection.datum() : [];


    // Scales
    scaleX
      .range([0, W])
      .domain([0, lineData.length]);

    scaleY
      .range([H, 0])
      .domain([0, 1]);

    // Axes
    const xAxisContext = d3.axisBottom(scaleX);
    const yAxisContext = d3.axisLeft(scaleY).ticks(2).tickFormat(d3.format('.1f'));

    // Line generator
    const line = d3.line()
      .x((d, i) => scaleX(i))
      .y(d => scaleY(d.e / 2))
      .curve(d3.curveStepAfter);

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

    const brush = d3.brushX()
      .extent([[0, 0], [W, H]])
      .on('end', brushed) // eslint-disable-line
      .on('brush', brushedForOverview); // eslint-disable-line

    const context = svgEnter.append('g')
      .attr('class', 'mainContext');

    context.append('path')
      .datum(lineData)
      .attr('fill', 'none')
      .attr('stroke', '#0F8554')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1)
      .attr('class', 'contextPath')
      .attr('d', line);

    context.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${H})`)
      .call(xAxisContext);

    context.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxisContext);

    const brushEl = svgEnter.append('g')
      .attr('class', 'brush')
      .call(brush);

    const unsubscribe = observe(state => state.alignment, (state) => {
      brushEl.call(brush.move, [0, state.rectCount].map(scaleX));
    });

    // Interactive functions
    function brushed() {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return;
      const s = d3.event.selection;
      const newRange = s.map((scaleX.invert));
      const domain = s.map(scaleX.invert, scaleX);
    }

    /* Update the range of the Overview line chart on 'brush' as opposed to
    on 'end' to enchance the usability.*/
    function brushedForOverview() {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return;
      const s = d3.event.selection;
      const newRange = s.map((scaleX.invert));
      const domain = s.map(scaleX.invert, scaleX);

      // Reducer
      dispatch(actions.updateFocus(newRange, domain));
      dispatch(actions.updateRecs(newRange, domain));
    }
  } // exports()

  return exports;
} // Context()

export default Context;

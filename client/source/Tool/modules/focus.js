import * as d3 from 'd3';
import actions from '../../actions/index';
import { getState, dispatch, observe } from '../../store';

function Focus() {
  const margin = { t: 20, r: 20, b: 40, l: 50 };
  let W;
  let H;

  const scaleX = d3.scaleLinear();
  const scaleY = d3.scaleLinear();
  const bisectPosition = d3.bisector(d => d.i).left;
  const rectWidth = 8;

  function exports(selection, clear) {
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
    const xAxis = d3.axisBottom(scaleX).tickSizeInner(15);
    const yAxis = d3.axisLeft(scaleY).ticks(2).tickSizeInner(10);

    // Line generator
    const lines = d3.line()
      .x(d => scaleX(d.i))
      .y(d => scaleY(d.e / 2))
      .curve(d3.curveStepAfter);

    // Signif values for display
    function precise(x) {
      return Number.parseFloat(x).toPrecision(3);
    }

    // Bisecting
    function mouseMove(ctx, test) {
      let mouseX;
      let mouseY;
      let x0;
      let i;
      let d0;
      let d1;
      let d;

      if (test !== null) {
        // event from reducer
        i = test.position;
        d1 = lineData[i];
        d = d1;
        mouseX = scaleX(i);
        mouseY = 20;
      } else {
        // event from this module
        mouseX = d3.mouse(ctx)[0];
        mouseY = d3.mouse(ctx)[1];
        x0 = scaleX.invert(mouseX);
        i = bisectPosition(lineData, x0, 1);
        d0 = lineData[i - 1];
        d1 = lineData[i];
        d = x0 - d0.i > d1.i - x0 ? d1 : d0;

        // Reducer
        dispatch(actions.coordinateDetail(d.i));
      }

      tooltip.select('.v-line') // eslint-disable-line
        .attr('transform', `translate(${scaleX(d.i) + (rectWidth / 2)}, 0)`);

      // tooltip.select('.h-line') // eslint-disable-line
      //   .attr('transform', `translate(0, ${scaleY(d.e / 2)})`);

      const entropyText = tooltip.select('text.t-entropy') // eslint-disable-line
        .text(`Shannon entropy: ${precise(d.e / 2)}`);

      const posText = tooltip.select('text.t-position') // eslint-disable-line
        .text(`Position: ${d.i}`);

      if (mouseX > W / 2) {
        entropyText.attr('transform', `translate(${scaleX(d.i) - 20}, ${mouseY})`)
          .attr('text-anchor', 'end');

        posText.attr('transform', `translate(${scaleX(d.i) - 20}, ${mouseY})`)
          .attr('text-anchor', 'end');
      } else {
        entropyText.attr('transform', `translate(${scaleX(d.i)}, ${mouseY})`)
          .attr('text-anchor', 'start');

        posText.attr('transform', `translate(${scaleX(d.i)}, ${mouseY})`)
          .attr('text-anchor', 'start');
      }
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
      .attr('stroke', '#0F8554')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', lines);

    focus.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${H})`)
      .call(xAxis);

    focus.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxis);

    // tooltip
    const tooltip = svgEnter.append('g')
      .style('display', 'none')
      .attr('class', 'tooltipFocus');

    svgEnter.append('rect')
      .attr('width', W)
      .attr('height', H)
      .attr('class', 'focusMouseCtx')
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => {
        tooltip.style('display', null);
        d3.select('.tooltipAlign').style('display', null);
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
        d3.select('.tooltipAlign').style('display', 'none');
      })
      .on('mousemove', function (d) {
        mouseMove(this, null);
      });

    tooltip.append('line')
      .attr('class', 'v-line')
      .style('stroke', '#666')
      .style('stroke-dasharray', '4,4')
      .style('opacity', 1)
      .attr('y1', 0)
      .attr('y2', H + margin.b);

    // tooltip.append('line')
    //   .attr('class', 'h-line')
    //   .style('stroke', '#666')
    //   .style('stroke-dasharray', '4,4')
    //   .style('opacity', 1)
    //   .attr('x1', 0)
    //   .attr('x2', W);

    tooltip.append('text')
      .attr('class', 't-entropy')
      .style('fill', 'black')
      .style('opacity', 0.8)
      .attr('dx', 8)
      .attr('dy', '-.3em');

    tooltip.append('text')
      .attr('class', 't-position')
      .style('fill', 'black')
      .style('opacity', 0.8)
      .attr('dx', 8)
      .attr('dy', '1em');

    // Disable brush stretching or generating a new brush
    d3.selectAll('.handle').style('pointer-events', 'none');
    d3.select('.brush').select('.overlay').attr('pointer-events', 'none');

    const context = d3.select('.focusMouseCtx').node();
    console.log(context);


    let unsubscribeHover;
    setTimeout(() => {
      unsubscribeHover = observe(state => state.alignHover, (state, nextState) => {
        console.log('position hovering on matrix inside focus', state);
        mouseMove(context, state);

        // console.log(context);
      }, 500);
    });


    const unsubscribe = observe(state => state.focus, (state, nextSate) => {
      const lower = Math.round(state.range[0]);
      const upper = Math.round(state.range[1]);

      scaleX.domain(state.domain);
      d3.select('#someid').attr('d', lines);
      focus.select('.axis--x').call(xAxis);
    });

    if (clear) {
      unsubscribe();
      setTimeout(() => {
        unsubscribeHover(), 600});
    }

  }

  return exports;
}

export default Focus;

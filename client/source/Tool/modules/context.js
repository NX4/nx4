import * as d3 from 'd3';
import actions from '../../actions/index';
import { getState, dispatch, observe } from '../../store';

const margin = { t: 20, r: 20, b: 20, l: 40 };
const scaleX = d3.scaleLinear();
const scaleY = d3.scaleLinear();
const ticks = scaleY.ticks(2);
const tickFormat = scaleY.tickFormat('.%');

export default class Context {
  constructor(node) {
    this.selection = d3.select(node);
    this.unsubscribe = () => {};
    this.brush;
  }

  unmountViz() {
    this.unsubscribe();
    this.brush.on('end', null);
    this.brush.on('brush', null);
  }

  render(data) {
    const W = W || this.selection.node().clientWidth - margin.l - margin.r;
    const H = H || this.selection.node().clientHeight - margin.t - margin.b;
    const lineData = data ? data : [];
    let test = 0;

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
    const svg = this.selection.selectAll('svg')
      .data([0]);

    const svgEnter = svg.enter()
      .append('svg')
      .attr('class', 'testContext')
      .attr('width', W + margin.l + margin.r)
      .attr('height', H + margin.t + margin.b)
      .on('click', function(d) {
        brushOnClick(this);
      })
      // .on('click', function (d) {
      //   console.log(this, 'was clicked');

      // })
      .merge(svg)
        .append('g')
        .attr('transform', `translate(${margin.l}, ${margin.t})`);

    this.brush = d3.brushX()
      .extent([[0, 0], [W, H]])
      .on('end', brushed) // eslint-disable-line
      .on('brush', brushedForOverview) // eslint-disable-line

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
    
    // Brush functionality
    const brushEl = svgEnter.append('g')
      .attr('class', 'brush')
      .call(this.brush)
      // .on('mousemove', function (d) {
      //   console.log('this', this);
      //   const test = d3.select(this).select('.overlay').node();
      //   console.log('overlay', test);
      //   console.log(d3.mouse(test)[0]);
      // });

    const brushObj = this.brush;  
    const contexts = d3.select('.testContext').node();

    this.unsubscribe = observe(state => state.alignment, (state) => {
      brushEl.call(this.brush.move, [0, state.rectCount].map(scaleX));
      test = state.rectCount;
    });

    // Interactive functions
    function brushed() {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return;
      const s = d3.event.selection;
      const newRange = s.map((scaleX.invert));
      const domain = s.map(scaleX.invert, scaleX);

      console.log('s in brushed()', s, newRange)
    }

    /* Update the range of the Overview line chart on 'brush' as opposed to
    on 'end' to enchance the usability.*/
    function brushedForOverview() {
      if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return;
      const s = d3.event.selection;
      const newRange = s.map((scaleX.invert));
      const domain = s.map(scaleX.invert, scaleX);

      console.log('s in brushedForOverview()', s, newRange)

      // Reducer
      dispatch(actions.updateFocus(newRange, domain));
      dispatch(actions.updateRecs(newRange, domain));
    }

    let brushWidth = observe(state => state.alignment, (state) => {
      return state.rectCount;
    });

    function brushOnClick(ctx) {

      // brushEl.call(brushObj.move, [x0, x0 + 30].map(scaleX));
      const brushOverlay = brushEl.select('.overlay').node();
      const dx = scaleX(8) - scaleX(0); // Use a fixed width when recentering.
      let cx = d3.mouse(brushOverlay)[0];
      // const x0 = cx - dx / 2;
      // const x1 = cx + dx / 2;

      let x0 = cx;
      let x1 = cx + test;

      console.log(
        {
        rectCount: test,
        mouseX: cx, 
        x1: x1,
        scaled: [x0, x1].map(scaleX),
        nonscaled: [x0, x1]
        
      });


      brushEl.call(brushObj.move, [x0, x1].map(scaleX));
      // brushEl.call(brushObj.move, x1 > W ? [W - dx, W] : x0 < 0 ? [0, dx] : [x0, x1]);

      //https://bl.ocks.org/mbostock/6498000
    }

  }

}

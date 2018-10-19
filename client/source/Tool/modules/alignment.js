import * as d3 from 'd3';
import { filter as _filter } from 'lodash';
import actions from '../../actions/index';
import { getState, dispatch, observe } from '../../store';

const margin = { t: 40, r: 20, b: 20, l: 50 };
const scaleX = d3.scaleLinear();
const scaleY = d3.scaleOrdinal();
const aminos = ['A', 'C', 'G', 'T', 'N'];
const rectWidth = 8;
const rectHeight = 25;
const scaleYRange = d3.range(0, rectHeight * 5, rectHeight + 5);
let totalRects;
let filteredData;
const smallPerc = '\uFE6A';

const color = d3.scaleLinear()
  .domain([1, 50, 99])
  .interpolate(d3.interpolateLab)
  .range([d3.rgb('#f3cbd3'), d3.rgb('#6c2167'), d3.rgb('#f3cbd3')]);

const bisectPosition = d3.bisector(d => d.pos).left;


export default class Alignment {
  constructor(node, clickAction) {
    this.selection = d3.select(node);
    this.clickOnRect = clickAction;
    this.unsubscribe;
    this.unsubscribe = () => {};
    this.unsubscribeHover = () => {};
  }

  unmountViz() {
    this.unsubscribe();
    this.unsubscribeHover();
    this.basepairsEnter.on('mouseover', null);
    this.basepairsEnter.on('mouseout', null);
    this.basepairsEnter.on('mousemove', null);
  }

  render(data) {
    const W = W || this.selection.node().clientWidth - margin.l - margin.r;
    const H = H || this.selection.node().clientHeight - margin.t - margin.b;
    const alignData = data ? data : [];

    // calculate width
    totalRects = Math.floor(W / rectWidth);
    dispatch(actions.setRectCount(totalRects));

    // Scales
    scaleX
      .range([0, W])
      .domain([0, totalRects]);

    scaleY
      .domain(aminos)
      .range(scaleYRange);

    // Axes
    const xAxisAlignment = d3.axisBottom(scaleX);
    const yAxisAlignment = d3.axisLeft(scaleY).ticks(2);

    // SVG initializer
    const svg = this.selection.selectAll('svg')
      .data([0]);

    const svgEnter = svg.enter()
      .append('svg')
      .attr('width', W + margin.l + margin.r)
      .attr('height', H + margin.t + margin.b)
      .merge(svg)
        .append('g')
        .attr('transform', `translate(${margin.l}, ${margin.t})`);


    // Heat map
    const basepairs = svgEnter.selectAll('rect')
      .data(alignData.slice(0, totalRects * 5));

    this.basepairsEnter = basepairs.enter().append('rect')
      .attr('class', 'rectangle')
      .attr('x', d => scaleX(d.pos))
      .attr('width', rectWidth)
      .attr('height', rectHeight)
      .attr('y', d => scaleY(d.type))
      .style('pointer-events', 'all')
      .on('click', d => {
        if(d.seqs[0] === 'all') {
          this.clickOnRect(d.pos, d.type, getState().sequence.all)
        }
        else {
          const list = [];
          for (let i = 0; i < d.seqs.length; i++) {
            list.push(getState().sequence.all.filter(seq => seq.id == d.seqs[i])[0].name);
          }
          this.clickOnRect(d.pos, d.type, list)
        }
      })
      .on('mouseover', () => {
        tooltip.style('display', null);
        d3.select('.tooltipFocus').style('display', null);
      })
      .on('mouseout', () => {
        tooltip.style('display', 'none');
        d3.select('.tooltipFocus').style('display', 'none');
      })
      .on('mousemove', (d) => {
        dispatch(actions.alignmentDetail(d.pos));
        mouseMove(d, 'pos');
      });

    function mouseMove(d, key) {
      const column = _filter(filteredData, o => o.pos === d[key]);
      scaleX.domain([filteredData[0].pos, filteredData[0].pos + totalRects]);

      tooltip.select('.l-line')
        .attr('transform', `translate(${scaleX(d[key])}, 0)`);

      tooltip.select('.r-line')
        .attr('transform', `translate(${scaleX(d[key] + 1)}, 0)`);

      tooltip.select('.triangle')
        .attr('transform', `translate(${scaleX(d[key])}, -5)`);

      tooltip.selectAll('.t-percent')
        .each(function (e, i) { d3.select(this).text(`${column[i].value}${smallPerc}`); });
    }

    svgEnter.append('g')
      .attr('class', 'axis axis--y')
      .call(yAxisAlignment);


    // Color legend
    const legendNode = svgEnter.append('g')
      .attr('id', 'legend')
      .attr('class', 'legend')
      .attr('transform', `translate(${0}, ${-margin.t})`);

    const legendScale = d3.scaleOrdinal()
      .domain(["0%", "1%", "50%", "99%", "100%"])
      .range([0, 20, 200, 400, 420]);

    const legendAxis = d3.axisBottom()
      .scale(legendScale);

    const defs = legendNode.append('defs');

    const linearGradient = defs.append('linearGradient')
      .attr('id', 'linear-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    linearGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", '#f3cbd3');

    linearGradient.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "#6c2167");

    linearGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#f3cbd3");

    legendNode.append('rect')
      .attr('width', 20)
      .attr('height', 10)
      .style('fill', '#f2f2f2');

    legendNode.append('rect')
      .attr('width', 400)
      .attr('height', 10)
      .style("fill", "url(#linear-gradient)")
      .attr('transform', 'translate(20, 0)')

    legendNode.append('rect')
      .attr('width', 20)
      .attr('height', 10)
      .style('fill', '#C0C0C0')
      .attr('transform', 'translate(420, 0)');

    legendNode.append('g')
      .attr('class', 'legendAxis')
      .attr('transform', `translate(${20}, ${0})`)
      .call(legendAxis);


    d3.select('#alignment-container').selectAll('line').style('display', 'none');

    // Modifying the position of the Y scale (nucleotides)
    d3.select('#alignment-container').selectAll('text')
      .attr('dy', (rectHeight / 2) + 2)
      .attr('dx', -30);

    // tooltip
    const tooltip = svgEnter.append('g')
      .style('display', 'none')
      .attr('class', 'tooltipAlign');

    tooltip.append('polygon')
      .attr('class', 'triangle')
      .attr('points', '0, -10 10, -10 5, 0');

    tooltip.append('line')
      .attr('class', 'l-line')
      .style('stroke', '#666')
      .style('stroke-dasharray', '4,4')
      .style('pointer-events', 'none')
      .style('opacity', 1)
      .attr('y1', 0)
      .attr('y2', (rectHeight * 5) + (5 * 6));

    tooltip.append('line')
      .attr('class', 'r-line')
      .style('stroke', '#666')
      .style('stroke-dasharray', '4,4')
      .style('pointer-events', 'none')
      .style('opacity', 1)
      .attr('y1', 0)
      .attr('y2', (rectHeight * 5) + (5 * 6));

    tooltip.selectAll('.t-percent')
      .data(aminos)
      .enter().append('text')
      .attr('class', 't-percent')
      .style('fill', 'black')
      .style('opacity', 0.8)
      .attr('text-anchor', 'end')
      .text('-%')
      .attr('transform', d => `translate(${-2}, ${scaleY(d) + (rectHeight / 2) + 4})`);

    setTimeout(() => {
      this.unsubscribeHover = observe(state => state.detailHover, (state) => {
        mouseMove(state, 'position');
      }, 300);
    });

    this.unsubscribe = observe(state => state.focus, (state) => {
      const lower = Math.round(state.range[0]);
      const upper = Math.round(state.range[1]);

      filteredData = _filter(alignData, o => o.pos >= lower && o.pos < upper);

      this.basepairsEnter.data(filteredData);

      this.basepairsEnter.transition().duration(10)
      .attr('fill', (d) => {
        if (d.value < color.domain()[0]) {
          return '#f2f2f2';
        } else if (d.value > color.domain()[2]) {
          return '#C0C0C0';
        } return color(d.value);
      });
    });
  }
};


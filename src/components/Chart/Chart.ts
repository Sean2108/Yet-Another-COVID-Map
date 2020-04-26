import * as d3 from "d3";
import Vue from "vue";
import { CaseCountRaw, CaseCount, DataTypes } from "@/types";

const LINE_MAPPING = [
  { type: DataTypes.CONFIRMED, text: "Confirmed cases", colour: "steelblue" },
  { type: DataTypes.DEATHS, text: "Deaths", colour: "red" },
  { type: DataTypes.RECOVERIES, text: "Recoveries", colour: "lightgreen" },
  { type: DataTypes.ACTIVE, text: "Active cases", colour: "orange" },
];

export default Vue.extend({
  mounted() {
    this.drawGraph(this.data as Array<CaseCountRaw>);
  },
  props: {
    id: String,
    data: Array,
    width: Number,
    height: Number,
    legendX: Number,
    legendY: Number,
    marginHorizontal: Number,
  },
  watch: {
    data: function(newVal) {
      d3.selectAll("svg").remove();
      this.drawGraph(newVal);
    },
  },
  methods: {
    onMouseEnter(svg: any, colour: string) {
      svg.select(`.chartlines#line-${colour}`).style("stroke-width", "3");
      svg
        .select(`.legendcircles#circle-${colour}`)
        .attr("r", 8)
        .style("stroke", "black");
      svg
        .selectAll(`.chartlines:not(#line-${colour})`)
        .style("stroke-width", "0.5");
    },
    onMouseLeave(svg: any) {
      svg.selectAll(".chartlines").style("stroke-width", "1.5");
      svg
        .selectAll(".legendcircles")
        .attr("r", 6)
        .style("stroke", "transparent");
    },
    drawLegend(svg: any, text: string, colour: string, legendYOffset: number) {
      svg
        .append("circle")
        .attr("cx", this.legendX)
        .attr("cy", this.legendY + legendYOffset)
        .attr("r", 6)
        .style("fill", colour)
        .attr("class", "legendcircles")
        .attr("id", `circle-${colour}`)
        .on("mouseenter", () => this.onMouseEnter(svg, colour))
        .on("mouseleave", () => this.onMouseLeave(svg));

      svg
        .append("text")
        .attr("x", this.legendX + 10)
        .attr("y", this.legendY + legendYOffset)
        .text(text)
        .style("font-size", "10px")
        .style("fill", "#fff")
        .attr("alignment-baseline", "middle")
        .on("mouseenter", () => this.onMouseEnter(svg, colour))
        .on("mouseleave", () => this.onMouseLeave(svg));
    },
    drawLegendSection(svg: any) {
      let yOffset = 0;
      LINE_MAPPING.forEach(({ text, colour }) => {
        this.drawLegend(svg, text, colour, yOffset);
        yOffset += 20;
      });
    },
    drawLine(
      svg: any,
      data: Array<CaseCount>,
      x: d3.ScaleTime<number, number>,
      lineColour: string,
      getYFunc: (d: CaseCount) => any
    ) {
      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", lineColour)
        .attr("stroke-width", 1.5)
        .attr("class", "chartlines")
        .attr("id", `line-${lineColour}`)
        .attr(
          "d",
          d3
            .line<CaseCount>()
            .x(function(d: CaseCount) {
              return x(d.date as Date);
            })
            .y(getYFunc)
            .curve(d3.curveMonotoneX)
        )
        .on("mouseenter", () => this.onMouseEnter(svg, lineColour))
        .on("mouseleave", () => this.onMouseLeave(svg));
    },
    drawGraph(input: Array<CaseCountRaw>) {
      const data: Array<CaseCount> = input.map(
        ({ date, confirmed, deaths, recovered }) => ({
          date: d3.timeParse("%-m/%-d/%y")(date),
          confirmed,
          deaths,
          recovered,
          active: Math.max(confirmed - deaths - recovered, 0),
        })
      );
      const margin = {
          top: 10,
          right: this.marginHorizontal,
          bottom: 20,
          left: this.marginHorizontal,
        },
        width = this.width - margin.left - margin.right,
        height = this.height - margin.top - margin.bottom;
      const svg = d3
        .select(`#${this.id}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      const x = d3
        .scaleTime()
        .domain(
          d3.extent(data, function(d) {
            return d.date;
          }) as [Date, Date]
        )
        .range([0, width]);
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(4));

      const y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, function(d) {
            return +d.confirmed;
          }) as number,
        ])
        .range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));
      LINE_MAPPING.forEach(({ type, colour }) =>
        this.drawLine(svg, data, x, colour, (d: CaseCount) => {
          return y(d[type]);
        })
      );

      this.drawLegendSection(svg);
    },
  },
});

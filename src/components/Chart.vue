<template>
  <div id="graph" />
</template>

<script>
import * as d3 from "d3";
export default {
  mounted() {
    this.drawGraph(this.data);
  },
  props: {
    data: Array,
  },
  watch: {
    data: function(newVal) {
      d3.selectAll("svg").remove();
      this.drawGraph(newVal);
    },
  },
  methods: {
    drawGraph(input) {
      const data = input.map(({ Date: d, Confirmed, Deaths }) => ({
        date: d3.timeParse("%-m/%-d/%y")(d),
        confirmed: Confirmed,
        deaths: Deaths,
      }));
      const margin = { top: 10, right: 30, bottom: 20, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 200 - margin.top - margin.bottom;
      const svg = d3
        .select("#graph")
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
          })
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
          }),
        ])
        .range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));

      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x(function(d) {
              return x(d.date);
            })
            .y(function(d) {
              return y(d.confirmed);
            })
        );
      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .line()
            .x(function(d) {
              return x(d.date);
            })
            .y(function(d) {
              return y(d.deaths);
            })
        );
      svg
        .append("circle")
        .attr("cx", 120)
        .attr("cy", 0)
        .attr("r", 6)
        .style("fill", "steelblue");
      svg
        .append("circle")
        .attr("cx", 120)
        .attr("cy", 20)
        .attr("r", 6)
        .style("fill", "red");
      svg
        .append("text")
        .attr("x", 130)
        .attr("y", 0)
        .text("Confirmed cases")
        .style("font-size", "10px")
        .style("fill", "#fff")
        .attr("alignment-baseline", "middle");
      svg
        .append("text")
        .attr("x", 130)
        .attr("y", 20)
        .text("Deaths")
        .style("font-size", "10px")
        .style("fill", "#fff")
        .attr("alignment-baseline", "middle");
    },
  },
};
</script>

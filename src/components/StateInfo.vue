<template>
  <v-expansion-panels accordion focusable dark>
    <v-subheader light>{{ getHeader() }}</v-subheader>

    <template v-if="newestStateData">
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate expand-icon="mdi-counter">
          Statistics (State)</v-expansion-panel-header
        >
        <v-expansion-panel-content>
          <br />
          <p>
            {{ getStatisticsDescription(newestStateData, "active") }}
          </p>
          <p>
            {{ getStatisticsDescription(newestStateData, "confirmed") }}
          </p>
          <p>
            {{ getStatisticsDescription(newestStateData, "deaths") }}
          </p>
          <p>
            {{ getStatisticsDescription(newestStateData, "recovered") }}
          </p>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel class="hidden-md-and-down">
        <v-expansion-panel-header
          disable-icon-rotate
          expand-icon="mdi-chart-line"
        >
          History (State)</v-expansion-panel-header
        >
        <v-expansion-panel-content>
          <Chart
            :chartData="stateData"
            id="stateChart"
            :width="420"
            :height="200"
            :legendX="265"
            :legendY="55"
            :marginLeft="55"
            :marginRight="115"
            :showPercentages="showPercentages"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </template>

    <template v-if="newestCountryData">
      <v-expansion-panel>
        <v-expansion-panel-header disable-icon-rotate expand-icon="mdi-counter">
          {{
            state ? "Statistics (Country)" : "Statistics"
          }}</v-expansion-panel-header
        >
        <v-expansion-panel-content>
          <br />
          <template v-if="countryData">
            <p>
              {{ getStatisticsDescription(newestCountryData, "active") }}
            </p>
            <p>
              {{ getStatisticsDescription(newestCountryData, "confirmed") }}
            </p>
            <p>
              {{ getStatisticsDescription(newestCountryData, "deaths") }}
            </p>
            <p>
              {{ getStatisticsDescription(newestCountryData, "recovered") }}
            </p>
          </template>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel class="hidden-md-and-down">
        <v-expansion-panel-header
          disable-icon-rotate
          expand-icon="mdi-chart-line"
        >
          {{
            state ? "History (Country)" : "History"
          }}</v-expansion-panel-header
        >
        <v-expansion-panel-content>
          <Chart
            :chartData="countryData"
            id="countryChart"
            :width="420"
            :height="200"
            :legendX="270"
            :legendY="55"
            :marginLeft="55"
            :marginRight="115"
            :showPercentages="showPercentages"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </template>

    <v-expansion-panel v-if="news.length">
      <v-expansion-panel-header
        disable-icon-rotate
        expand-icon="mdi-newspaper-variant"
      >
        News</v-expansion-panel-header
      >
      <v-expansion-panel-content>
        <News :news="news" height="20"
      /></v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import Vue from "vue";
import News from "./News.vue";
import Chart from "./Chart.vue";
import { fetchData, getRatios } from "../utils";
import {
  NewsItem,
  Endpoints,
  CaseCountAggregated,
  CaseCountAggregatedWithRatios,
  DataTypes,
} from "@/types";
import Vuetify from "vuetify";

Vue.use(Vuetify);

interface ComponentData {
  stateData: Array<CaseCountAggregatedWithRatios>;
  countryData: Array<CaseCountAggregatedWithRatios>;
  news: Array<NewsItem>;
}

export default Vue.extend({
  components: {
    News,
    Chart,
  },
  data(): ComponentData {
    return {
      stateData: [],
      countryData: [],
      news: [],
    };
  },
  props: {
    country: String,
    state: String,
    iso: String,
    showPercentages: Boolean,
  },
  created() {
    if (this.state) {
      fetchData(Endpoints.CASES, "", "", this.iso, false, true, false).then(
        (response) => {
          if (response) {
            this.stateData = response[this.iso].states[this.state].counts.map(
              getRatios
            );
          }
        }
      );
    }
    fetchData(Endpoints.CASES, "", "", this.iso, true, true, false).then(
      (response) => {
        if (response) {
          const countryInfo = response[this.iso];
          this.countryData = countryInfo.counts.map(
            (item: CaseCountAggregated) =>
              getRatios({ ...item, population: countryInfo.population })
          );
        }
      }
    );

    fetchData(Endpoints.NEWS, "", "", this.country, false, false, false).then(
      (response) => (this.news = response || [])
    );
  },
  computed: {
    newestStateData(): CaseCountAggregatedWithRatios {
      return this.stateData[this.stateData.length - 1];
    },
    newestCountryData(): CaseCountAggregatedWithRatios {
      return this.countryData[this.countryData.length - 1];
    },
  },
  methods: {
    getHeader: function() {
      return this.state ? `${this.state} (${this.country})` : this.country;
    },
    getStatisticsDescription: function(data: any, type: DataTypes) {
      if (type === DataTypes.ACTIVE) {
        const active = Math.max(
          data.confirmed - data.deaths - data.recovered,
          0
        );
        return `Active cases: ${active.toLocaleString()}`;
      }
      const roundingDivisor = type === DataTypes.CONFIRMED ? 1000 : 100;
      return `${this.getPrefix(type)}: ${data[
        type
      ].toLocaleString()} (${this.getRateType(type)} rate of ${Math.round(
        data[type + "Ratio"] * roundingDivisor
      ) / roundingDivisor}%)`;
    },
    getPrefix: function(type: DataTypes) {
      switch (type) {
        case DataTypes.DEATHS:
          return "Deaths";
        case DataTypes.RECOVERIES:
          return "Recoveries";
        case DataTypes.CONFIRMED:
        default:
          return "Confirmed cases";
      }
    },
    getRateType: function(type: DataTypes) {
      switch (type) {
        case DataTypes.DEATHS:
          return "Fatality";
        case DataTypes.RECOVERIES:
          return "Recovery";
        case DataTypes.CONFIRMED:
        default:
          return "Infection";
      }
    },
  },
});
</script>

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
            Active cases:
            {{
              Math.max(
                newestStateData.confirmed -
                  newestStateData.deaths -
                  newestStateData.recovered,
                0
              )
            }}
          </p>
          <p>
            Confirmed cases: {{ newestStateData.confirmed }} (Infection rate of
            {{ Math.round(newestStateData.confirmedRatio * 100) / 100 }}%)
          </p>
          <p>
            Deaths: {{ newestStateData.deaths }} (Fatality rate of
            {{ Math.round(newestStateData.deathsRatio * 100) / 100 }}%)
          </p>
          <p>
            Recoveries: {{ newestStateData.recovered }} (Recovery rate of
            {{ Math.round(newestStateData.recoveredRatio * 100) / 100 }}%)
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
            :data="stateData"
            id="stateChart"
            :width="420"
            :height="200"
            :legendX="265"
            :legendY="55"
            :marginLeft="45"
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
              Active cases:
              {{
                Math.max(
                  newestCountryData.confirmed -
                    newestCountryData.deaths -
                    newestCountryData.recovered,
                  0
                )
              }}
            </p>
            <p>
              Confirmed cases: {{ newestCountryData.confirmed }} (Infection rate
              of
              {{ Math.round(newestCountryData.confirmedRatio * 100) / 100 }}%)
            </p>
            <p>
              Deaths: {{ newestCountryData.deaths }} (Fatality rate of
              {{ Math.round(newestCountryData.deathsRatio * 100) / 100 }}%)
            </p>
            <p>
              Recoveries: {{ newestCountryData.recovered }} (Recovery rate of
              {{ Math.round(newestCountryData.recoveredRatio * 100) / 100 }}%)
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
            :data="countryData"
            id="countryChart"
            :width="420"
            :height="200"
            :legendX="270"
            :legendY="55"
            :marginLeft="45"
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
import { NewsItem, Endpoints, CaseCountAggregatedWithRatios } from "@/types";
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
    Chart
  },
  data(): ComponentData {
    return {
      stateData: [],
      countryData: [],
      news: []
    };
  },
  props: {
    country: String,
    state: String,
    iso: String,
    showPercentages: Boolean
  },
  created() {
    if (this.state) {
      fetchData(Endpoints.CASES, "", "", this.iso, false, true, false).then(
        response => {
          if (response) {
            this.stateData = response[this.iso].states[this.state].counts.map(
              getRatios
            );
          }
        }
      );
    }
    fetchData(Endpoints.CASES, "", "", this.iso, true, true, false).then(
      response => {
        if (response) {
          this.countryData = response[this.iso].counts.map(getRatios);
        }
      }
    );

    fetchData(Endpoints.NEWS, "", "", this.country, false, false, false).then(
      response => (this.news = response || [])
    );
  },
  computed: {
    newestStateData(): CaseCountAggregatedWithRatios {
      return this.stateData[this.stateData.length - 1];
    },
    newestCountryData(): CaseCountAggregatedWithRatios {
      return this.countryData[this.countryData.length - 1];
    }
  },
  methods: {
    getHeader: function() {
      return this.state ? `${this.state} (${this.country})` : this.country;
    }
  }
});
</script>

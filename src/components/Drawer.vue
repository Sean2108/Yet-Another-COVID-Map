<template>
  <v-navigation-drawer
    v-model="drawer"
    color="grey darken-2"
    width="550"
    expand-on-hover
    right
    absolute
    dark
  >
    <v-list-item nav>
      <v-list-item-icon>
        <v-icon>mdi-earth</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>Global Data</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list nav three-line>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-counter</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Statistics</v-list-item-title>
          <v-list-item-subtitle v-if="worldData">
            <p>Active cases: {{ getActive }}</p>
            <p>
              Confirmed cases: {{ getConfirmed }} (Infection rate of
              {{ getInfectionRate }}%)
            </p>
            <p>
              Deaths: {{ getDeaths }} (Fatality rate of {{ getFatalityRate }}%)
            </p>
            <p>
              Recoveries: {{ getRecoveries }} (Recovery rate of
              {{ getRecoveryRate }}%)
            </p>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-chart-line</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>History</v-list-item-title>
          <v-list-item-subtitle>
            <Chart
              v-if="worldData"
              id="global-chart"
              :chartData="worldData"
              :width="460"
              :height="200"
              :legendX="295"
              :legendY="55"
              :marginLeft="60"
              :marginRight="150"
              :showPercentages="showPercentages"
            />
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider />

      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-newspaper-variant</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>News</v-list-item-title>
          <v-list-item-subtitle>
            <News country="" :news="news" />
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import { fetchData, getRatios } from "../utils";
import Chart from "./Chart.vue";
import News from "./News.vue";
import Table from "./Table.vue";
import { CaseCountRaw, NewsItem, DataTypes, Endpoints } from "@/types";

const WORLD_POPULATION = 7800000000;

interface ComponentData {
  drawer: boolean;
  news: Array<NewsItem>;
  range: Array<number>;
  showPercentages: boolean;
}

export default Vue.extend({
  components: {
    Chart,
    News
  },
  props: {
    worldData: Array
  },
  data(): ComponentData {
    return {
      drawer: true,
      news: [],
      range: [0, 0],
      showPercentages: false
    };
  },
  created() {
    fetchData(Endpoints.NEWS, "", "", "", false, false, false).then(
      response => (this.news = response || [])
    );
    this.range = [0, this.worldData.length - 1];
    this.$root.$on(
      "onChangeShowPercentages",
      (value: boolean) => (this.showPercentages = value)
    );
    this.$root.$on(
      "changeDateRange",
      (range: Array<number>) => (this.range = range)
    );
  },
  computed: {
    getConfirmed: function(): number {
      return this.getStats(
        this.worldData as Array<CaseCountRaw>,
        DataTypes.CONFIRMED,
        this.range
      );
    },
    getDeaths: function(): number {
      return this.getStats(
        this.worldData as Array<CaseCountRaw>,
        DataTypes.DEATHS,
        this.range
      );
    },
    getRecoveries: function(): number {
      return this.getStats(
        this.worldData as Array<CaseCountRaw>,
        DataTypes.RECOVERIES,
        this.range
      );
    },
    getActive: function(): number {
      return this.getStats(
        this.worldData as Array<CaseCountRaw>,
        DataTypes.ACTIVE,
        this.range
      );
    },
    getInfectionRate: function(): number {
      return (
        Math.round(
          getRatios({
            confirmed: this.getConfirmed,
            deaths: this.getDeaths,
            recovered: this.getRecoveries,
            population: WORLD_POPULATION
          }).confirmedRatio * 1000
        ) / 1000
      );
    },
    getFatalityRate: function(): number {
      return (
        Math.round(
          getRatios({
            confirmed: this.getConfirmed,
            deaths: this.getDeaths,
            recovered: this.getRecoveries,
            population: WORLD_POPULATION
          }).deathsRatio * 100
        ) / 100
      );
    },
    getRecoveryRate: function(): number {
      return (
        Math.round(
          getRatios({
            confirmed: this.getConfirmed,
            deaths: this.getDeaths,
            recovered: this.getRecoveries,
            population: WORLD_POPULATION
          }).recoveredRatio * 100
        ) / 100
      );
    }
  },
  methods: {
    getStats: function(
      data: Array<CaseCountRaw>,
      key: DataTypes,
      [from, to]: Array<number>
    ): number {
      if (key === DataTypes.ACTIVE) {
        return Math.max(
          this.getConfirmed - this.getDeaths - this.getRecoveries,
          0
        );
      }
      return data[to][key] - (from === 0 ? 0 : data[from - 1][key]);
    }
  }
});
</script>

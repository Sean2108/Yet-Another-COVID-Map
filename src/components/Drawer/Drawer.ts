import Vue from "vue";
import { fetchData, getRatios } from "../../utils";
import Chart from "../Chart/Chart.vue";
import News from "../News/News.vue";
import Table from "../Table/Table.vue";
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
    News,
    Table
  },
  props: {
    data: Array
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
    this.$root.$on(
      "onChangeShowPercentages",
      (value: boolean) => (this.showPercentages = value)
    );
  },
  mounted() {
    this.range = [0, this.data.length - 1];
    this.$root.$on(
      "changeDateRange",
      (range: Array<number>) => (this.range = range)
    );
  },
  computed: {
    getConfirmed: function(): number {
      return this.getStats(
        this.data as Array<CaseCountRaw>,
        DataTypes.CONFIRMED,
        this.range
      );
    },
    getDeaths: function(): number {
      return this.getStats(
        this.data as Array<CaseCountRaw>,
        DataTypes.DEATHS,
        this.range
      );
    },
    getRecoveries: function(): number {
      return this.getStats(
        this.data as Array<CaseCountRaw>,
        DataTypes.RECOVERIES,
        this.range
      );
    },
    getActive: function(): number {
      return this.getStats(
        this.data as Array<CaseCountRaw>,
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
          }).confirmedRatio * 100
        ) / 100
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
      return data[to][key] - (from === 0 ? 0 : data[from][key]);
    }
  }
});

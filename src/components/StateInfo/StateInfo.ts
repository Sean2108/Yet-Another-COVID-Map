import Vue from "vue";
import News from "../News/News.vue";
import Chart from "../Chart/Chart.vue";
import { fetchData, getRatios } from "../../utils";
import { NewsItem, CaseCountRaw, DataTypes, Endpoints } from "@/types";
import Vuetify from "vuetify";

Vue.use(Vuetify);

interface ComponentData {
  stateData: Array<CaseCountRaw>;
  countryData: Array<CaseCountRaw>;
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
  props: { country: String, state: String },
  created() {
    if (this.state) {
      fetchData(Endpoints.CASES, "", "", this.country, false, true, false).then(
        (response) => {
          if (response) {
            this.stateData = response[this.country][this.state].counts;
          }
        }
      );
    }
    fetchData(Endpoints.CASES, "", "", this.country, true, true, false).then(
      (response) => {
        if (response) {
          this.countryData = response[this.country].counts;
        }
      }
    );

    fetchData(Endpoints.NEWS, "", "", this.country, false, false, false).then(
      (response) => (this.news = response || [])
    );
  },
  computed: {
    getStateConfirmed: function(): number {
      return this.getStats(this.stateData, DataTypes.CONFIRMED);
    },
    getStateDeaths: function(): number {
      return this.getStats(this.stateData, DataTypes.DEATHS);
    },
    getStateRecoveries: function(): number {
      return this.getStats(this.stateData, DataTypes.RECOVERIES);
    },
    getCountryConfirmed: function(): number {
      return this.getStats(this.countryData, DataTypes.CONFIRMED);
    },
    getCountryDeaths: function(): number {
      return this.getStats(this.countryData, DataTypes.DEATHS);
    },
    getCountryRecoveries: function(): number {
      return this.getStats(this.countryData, DataTypes.RECOVERIES);
    },
    getStateFatalityRate: function(): number {
      return (
        Math.round(
          getRatios(
            this.getStateConfirmed,
            this.getStateDeaths,
            this.getStateRecoveries
          ).deathsRatio * 100
        ) / 100
      );
    },
    getStateRecoveryRate: function(): number {
      return (
        Math.round(
          getRatios(
            this.getStateConfirmed,
            this.getStateDeaths,
            this.getStateRecoveries
          ).recoveredRatio * 100
        ) / 100
      );
    },
    getCountryFatalityRate: function(): number {
      return (
        Math.round(
          getRatios(
            this.getCountryConfirmed,
            this.getCountryDeaths,
            this.getCountryRecoveries
          ).deathsRatio * 100
        ) / 100
      );
    },
    getCountryRecoveryRate: function(): number {
      return (
        Math.round(
          getRatios(
            this.getCountryConfirmed,
            this.getCountryDeaths,
            this.getCountryRecoveries
          ).recoveredRatio * 100
        ) / 100
      );
    },
  },
  methods: {
    getHeader: function() {
      return this.state ? `${this.state} (${this.country})` : this.country;
    },
    getStats: function(data: Array<CaseCountRaw>, key: DataTypes): number {
      return data[data.length - 1][key];
    },
  },
});

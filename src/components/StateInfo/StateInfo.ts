import Vue from "vue";
import News from "../News/News.vue";
import Chart from "../Chart/Chart.vue";
import { fetchData } from "../../utils";
import { NewsItem, CaseCountRaw } from "@/types";
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
      fetchData("cases", "", "", this.country, false, true, false).then(
        (response) =>
          (this.stateData = response[this.country][this.state].counts)
      );
    }
    fetchData("cases", "", "", this.country, true, true, false).then(
      (response) => (this.countryData = response[this.country].counts)
    );

    fetchData("news", "", "", this.country, false, false, false).then(
      (response) => (this.news = response)
    );
  },
  computed: {
    getStateConfirmed: function(): number | string {
      return this.getStats(this.stateData, true);
    },
    getStateDeaths: function(): number | string {
      return this.getStats(this.stateData, false);
    },
    getCountryConfirmed: function(): number | string {
      return this.getStats(this.countryData, true);
    },
    getCountryDeaths: function(): number | string {
      return this.getStats(this.countryData, false);
    },
  },
  methods: {
    getHeader: function() {
      return this.state ? `${this.state} (${this.country})` : this.country;
    },
    getStats: function(
      data: Array<CaseCountRaw>,
      getConfirmed: boolean
    ): number | string {
      return data.length
        ? data[data.length - 1][getConfirmed ? "confirmed" : "deaths"]
        : "Unknown";
    },
  },
});

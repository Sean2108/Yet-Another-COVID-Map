import Vue from "vue";
import News from "../News/News.vue";
import Chart from "../Chart/Chart.vue";
import { fetchData } from "../../utils";
import { NewsItem, CaseCountRaw, DataTypes } from "@/types";
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
      return this.getStats(this.stateData, DataTypes.CONFIRMED);
    },
    getStateDeaths: function(): number | string {
      return this.getStats(this.stateData, DataTypes.DEATHS);
    },
    getStateRecoveries: function(): number | string {
      return this.getStats(this.stateData, DataTypes.RECOVERIES);
    },
    getCountryConfirmed: function(): number | string {
      return this.getStats(this.countryData, DataTypes.CONFIRMED);
    },
    getCountryDeaths: function(): number | string {
      return this.getStats(this.countryData, DataTypes.DEATHS);
    },
    getCountryRecoveries: function(): number | string {
      return this.getStats(this.countryData, DataTypes.RECOVERIES);
    },
  },
  methods: {
    getHeader: function() {
      return this.state ? `${this.state} (${this.country})` : this.country;
    },
    getStats: function(
      data: Array<CaseCountRaw>,
      key: DataTypes
    ): number | string {
      return data.length
        ? data[data.length - 1][key]
        : "Unknown";
    },
  },
});

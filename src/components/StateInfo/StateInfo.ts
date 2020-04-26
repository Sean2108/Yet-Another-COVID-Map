import Vue from "vue";
import News from "../News/News.vue";
import Chart from "../Chart/Chart.vue";
import { fetchData, getRatios } from "../../utils";
import {
  NewsItem,
  CaseCountRaw,
  DataTypes,
  Endpoints,
  CaseCountAggregated,
  CaseCountAggregatedWithRatios,
} from "@/types";
import Vuetify from "vuetify";

Vue.use(Vuetify);

interface ComponentData {
  stateData: CaseCountAggregatedWithRatios | null;
  countryData: CaseCountAggregatedWithRatios | null;
  news: Array<NewsItem>;
}

export default Vue.extend({
  components: {
    News,
    Chart,
  },
  data(): ComponentData {
    return {
      stateData: null,
      countryData: null,
      news: [],
    };
  },
  props: { country: String, state: String, iso: String },
  created() {
    if (this.state) {
      fetchData(Endpoints.CASES, "", "", this.iso, false, false, false).then(
        (response) => {
          if (response) {
            this.stateData = getRatios(response[this.iso].states[this.state]);
          }
        }
      );
    }
    fetchData(Endpoints.CASES, "", "", this.iso, true, false, false).then(
      (response) => {
        if (response) {
          this.countryData = getRatios(response[this.iso]);
        }
      }
    );

    fetchData(Endpoints.NEWS, "", "", this.country, false, false, false).then(
      (response) => (this.news = response || [])
    );
  },
  methods: {
    getHeader: function() {
      return this.state ? `${this.state} (${this.country})` : this.country;
    },
  },
});

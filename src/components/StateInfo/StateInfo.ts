import Vue from "vue";
import News from "../News/News.vue";
import Chart from "../Chart/Chart.vue";
import { fetchData, getRatios } from "../../utils";
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

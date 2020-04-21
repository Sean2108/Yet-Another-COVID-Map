import Vue from "vue";
import News from "../News/News.vue";
import Chart from "../Chart/Chart.vue";
import { fetchData } from "../../utils";
import { CaseCountCapitalised, NewsItem } from "@/types";
import Vuetify from "vuetify";

Vue.use(Vuetify);

interface ComponentData {
  stateData: Array<CaseCountCapitalised> | null;
  countryData: Array<CaseCountCapitalised> | null;
  news: Array<NewsItem> | null;
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
      news: null,
    };
  },
  props: { country: String, state: String },
  created() {
    if (this.state) {
      fetchData("cases", "", "", this.country, false, true, false).then(
        (response) =>
          (this.stateData = response[this.country][this.state].Counts)
      );
    }
    fetchData("cases", "", "", this.country, true, true, false).then(
      (response) => (this.countryData = response[this.country].Counts)
    );

    fetchData("news", "", "", this.country, false, false, false).then(
      (response) => (this.news = response)
    );
  },
  computed: {
    getStateConfirmed: function() {
      const data = this.stateData as Array<CaseCountCapitalised> | null;
      return data ? data[data.length - 1].Confirmed : "Unknown";
    },
    getStateDeaths: function() {
      const data = this.stateData as Array<CaseCountCapitalised> | null;
      return data ? data[data.length - 1].Deaths : "Unknown";
    },
    getCountryConfirmed: function() {
      const data = this.countryData as Array<CaseCountCapitalised> | null;
      return data ? data[data.length - 1].Confirmed : "Unknown";
    },
    getCountryDeaths: function() {
      const data = this.countryData as Array<CaseCountCapitalised> | null;
      return data ? data[data.length - 1].Deaths : "Unknown";
    },
    hasNews: function() {
      const news = this.news as Array<NewsItem> | null;
      return news && news.length;
    },
  },
  methods: {
    getHeader: function() {
      return this.state ? `${this.state} (${this.country})` : this.country;
    },
  },
});

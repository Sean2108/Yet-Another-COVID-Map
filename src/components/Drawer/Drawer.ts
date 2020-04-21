import Vue from "vue";
import { fetchData } from "../../utils";
import Chart from "../Chart/Chart.vue";
import News from "../News/News.vue";
import { CaseCountCapitalised, NewsItem } from "@/types";

interface ComponentData {
  drawer: boolean;
  news: Array<NewsItem> | null;
  range: Array<number>;
}

export default Vue.extend({
  components: {
    Chart,
    News,
  },
  props: {
    data: Array,
  },
  data(): ComponentData {
    return {
      drawer: true,
      news: null,
      range: [0, 0],
    };
  },
  created() {
    fetchData("news", "", "", "", false, false, false).then(
      (response) => (this.news = response)
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
    getConfirmed: function() {
      const [from, to] = this.range as Array<number>;
      const data = this.data as Array<CaseCountCapitalised>;
      return data[to].Confirmed - (from === 0 ? 0 : data[from].Confirmed);
    },
    getDeaths: function() {
      const [from, to] = this.range as Array<number>;
      const data = this.data as Array<CaseCountCapitalised>;
      return data[to].Deaths - (from === 0 ? 0 : data[from].Deaths);
    },
  },
});

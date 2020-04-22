import Vue from "vue";
import { fetchData } from "../../utils";
import Chart from "../Chart/Chart.vue";
import News from "../News/News.vue";
import { CaseCountRaw, NewsItem } from "@/types";

interface ComponentData {
  drawer: boolean;
  news: Array<NewsItem>;
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
      news: [],
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
      const data = this.data as Array<CaseCountRaw>;
      return data[to].confirmed - (from === 0 ? 0 : data[from].confirmed);
    },
    getDeaths: function() {
      const [from, to] = this.range as Array<number>;
      const data = this.data as Array<CaseCountRaw>;
      return data[to].deaths - (from === 0 ? 0 : data[from].deaths);
    },
  },
});

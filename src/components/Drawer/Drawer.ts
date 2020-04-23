import Vue from "vue";
import { fetchData } from "../../utils";
import Chart from "../Chart/Chart.vue";
import News from "../News/News.vue";
import { CaseCountRaw, NewsItem, DataTypes, Endpoints } from "@/types";

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
    fetchData(Endpoints.NEWS, "", "", "", false, false, false).then(
      (response) => (this.news = response || [])
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
  },
  methods: {
    getStats: function(
      data: Array<CaseCountRaw>,
      key: DataTypes,
      [from, to]: Array<number>
    ): number {
      return data[to][key] - (from === 0 ? 0 : data[from][key]);
    },
  },
});

import Vue from "vue";
import { fetchData } from "../../utils";
import { News } from "@/types";

interface ComponentData {
  news: Array<News> | null;
}

export default Vue.extend({
  async created() {
    this.news = await fetchData("news", "", "", "", false, false, false);
  },
  data(): ComponentData {
    return {
      news: null,
    };
  },
  props: {
    country: String,
  },
  watch: {
    country: async function(newCountry: string) {
      const news = await fetchData(
        "news",
        "",
        "",
        newCountry,
        false,
        false,
        false
      );
      if (news && news.length) {
        this.news = news;
      }
    },
  },
});

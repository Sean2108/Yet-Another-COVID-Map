import * as _ from "lodash";
import Vue from "vue";
import { fetchData } from "../../utils";
import Chart from "../Chart/Chart.vue";
import News from "../News/News.vue";
import { CaseCountCapitalised } from "@/types";

interface ComponentData {
  drawer: boolean;
  country: string | null;
  data: Array<CaseCountCapitalised> | null;
  range: Array<number> | null;
  max: number | null;
  from: string | null;
  to: string | null;
  showConfirmed: boolean;
}

export default Vue.extend({
  components: {
    Chart,
    News,
  },
  async created() {
    this.data = await fetchData("cases", "", "", "", false, false, true);
    if (this.data) {
      this.max = this.data.length - 1;
      this.range = [0, this.max];
      this.from = this.data[0].Date;
      this.to = this.data[this.max].Date;
    }
  },
  mounted() {
    this.$root.$on("countrySelected", async (country: string) => {
      this.country = country;
      const countryData = await fetchData(
        "cases",
        "",
        "",
        country,
        true,
        true,
        false
      );
      this.data = countryData[country].Counts;
    });
  },
  data(): ComponentData {
    return {
      drawer: true,
      country: null,
      data: null,
      range: null,
      max: null,
      from: null,
      to: null,
      showConfirmed: true,
    };
  },
  computed: {
    getConfirmed: function() {
      const [from, to] = this.range as Array<number>;
      const data = this.data as Array<CaseCountCapitalised> | null;
      return data
        ? data[to].Confirmed - (from === 0 ? 0 : data[from].Confirmed)
        : "";
    },
    getDeaths: function() {
      const [from, to] = this.range as Array<number>;
      const data = this.data as Array<CaseCountCapitalised> | null;
      return data ? data[to].Deaths - (from === 0 ? 0 : data[from].Deaths) : "";
    },
  },
  methods: {
    updateDates([fromIndex, toIndex]: Array<number>) {
      if (!this.data) {
        return;
      }
      this.from = this.data[fromIndex].Date;
      this.to = this.data[toIndex].Date;
      _.debounce(() => {
        this.$root.$emit("changeDates", { from: this.from, to: this.to });
      }, 2000)();
    },
    changeShowConfirmed(showConfirmed: boolean) {
      this.$root.$emit("changeShowConfirmed", showConfirmed);
    },
  },
});

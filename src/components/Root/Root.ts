import Vue from "vue";
import { fetchData } from "../../utils";
import Drawer from "../Drawer/Drawer.vue";
import Map from "../Map/Map.vue";
import Filters from "../Filters/Filters.vue";
import Counter from "../Counter/Counter.vue";
import Table from "../Table/Table.vue";
import { Endpoints, DataTypes } from "@/types";

export default Vue.extend({
  components: {
    Drawer,
    Map,
    Filters,
    Counter,
    Table
  },

  data: () => ({
    data: [],
    counts: {
      [DataTypes.CONFIRMED]: 0,
      [DataTypes.DEATHS]: 0,
      [DataTypes.RECOVERIES]: 0,
      [DataTypes.ACTIVE]: 0
    },
    overlayCardWidth: "480px",
    scaleClass: "",
    loading: true
  }),
  created() {
    this.$root.$on(
      "setLoading",
      (loading: boolean) => (this.loading = loading)
    );
    this.onResize();
    fetchData(Endpoints.CASES, "", "", "", false, false, true).then(
      response => {
        if (response) {
          this.data = response;
          const { confirmed, deaths, recovered } = response[
            response.length - 1
          ];
          this.counts = {
            [DataTypes.CONFIRMED]: confirmed,
            [DataTypes.DEATHS]: deaths,
            [DataTypes.RECOVERIES]: recovered,
            [DataTypes.ACTIVE]: Math.max(confirmed - deaths - recovered, 0)
          };
        }
        this.loading = false;
      }
    );
  },
  methods: {
    onResize() {
      const { innerWidth, innerHeight } = window;
      // probably a mobile device
      if (innerWidth <= innerHeight) {
        switch (this.$vuetify.breakpoint.name) {
          case "xs":
            this.scaleClass = "small-scale-down";
            return;
          case "sm":
          case "md":
            this.scaleClass = "med-scale-down";
            return;
          case "lg":
            this.scaleClass = "large-scale-down";
            return;
          default:
            this.scaleClass = "";
            return;
        }
      }
      const ranges: { [key: string]: Array<number> } = {
        "small-scale-down": [0, 300],
        "med-scale-down": [0, 600],
        "large-scale-down": [600, 900]
      };
      for (const key in ranges) {
        const [lower, upper] = ranges[key];
        if (innerHeight >= lower && innerHeight < upper) {
          this.scaleClass = key;
          return;
        }
      }
      this.scaleClass = "";
      return;
    }
  }
});

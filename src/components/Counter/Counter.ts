import Vue from "vue";
import { DataTypes } from "@/types";

export default Vue.extend({
  data: () => ({
    type: DataTypes.CONFIRMED,
  }),
  props: {
    width: String,
    data: Object,
  },
  mounted() {
    this.$root.$on("changeType", (type: DataTypes) => (this.type = type));
  },
  computed: {
    header(): string {
      switch (this.type) {
        case DataTypes.CONFIRMED:
          return "Confirmed";
        case DataTypes.DEATHS:
          return "Deaths";
        default:
          return "Recoveries";
      }
    },
    style(): string {
      return `top: ${this.$vuetify.breakpoint.xlOnly ? "35vh" : "45vh"}`;
    },
  },
});

import Vue from "vue";
import { DataTypes } from "@/types";
import _ from "lodash";

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
      return _.capitalize(this.type);
    },
  },
});

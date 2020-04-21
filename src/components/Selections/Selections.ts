import Vue from "vue";
import * as _ from "lodash";
import { CaseCountCapitalised } from "@/types";

interface ComponentData {
  range: Array<number>;
  max: number;
  showConfirmed: boolean;
}

export default Vue.extend({
  data: (): ComponentData => ({
    range: [0, 0],
    max: 0,
    showConfirmed: true,
  }),
  props: {
    data: Array,
  },
  mounted() {
    this.max = this.data.length - 1;
    this.range = [0, this.max];
  },
  methods: {
    updateDates(range: Array<number>) {
      const data = this.data as Array<CaseCountCapitalised>;
      this.$root.$emit("changeDateRange", this.range);
      const [from, to] = this.range;
      _.debounce(() => {
        this.$root.$emit("changeDates", {
          from: data[from].Date,
          to: data[to].Date,
        });
      }, 2000)();
    },
    changeShowConfirmed(showConfirmed: boolean) {
      this.showConfirmed = showConfirmed;
      this.$root.$emit("changeShowConfirmed", showConfirmed);
    },
  },
  computed: {
    from() {
      const data = this.data as Array<CaseCountCapitalised>;
      const [from] = this.range;
      return data[from].Date;
    },
    to() {
      const data = this.data as Array<CaseCountCapitalised>;
      const [, to] = this.range;
      return data[to].Date;
    },
  },
});

import Vue from "vue";
import _ from "lodash";
import { CaseCountRaw } from "@/types";

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
    debouncedEmitChangeDates: _.debounce(function(this: any) {
      const [from, to] = this.range;
      const data = this.data as Array<CaseCountRaw>;
      this.$root.$emit("changeDates", {
        range: this.range,
        from: data[from].date,
        to: data[to].date,
      });
    }, 1000),
    updateDates(range: Array<number>) {
      this.$root.$emit("changeDateRange", range);
      this.debouncedEmitChangeDates();
    },
    changeShowConfirmed(showConfirmed: boolean) {
      this.showConfirmed = showConfirmed;
      this.$root.$emit("changeShowConfirmed", showConfirmed);
    },
  },
  computed: {
    from() {
      const data = this.data as Array<CaseCountRaw>;
      const [from] = this.range;
      return data[from].date;
    },
    to() {
      const data = this.data as Array<CaseCountRaw>;
      const [, to] = this.range;
      return data[to].date;
    },
  },
});

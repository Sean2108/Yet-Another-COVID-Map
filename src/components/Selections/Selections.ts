import Vue from "vue";
import _ from "lodash";
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
    debouncedEmitChangeDates: _.debounce(function(this: any) {
      const [from, to] = this.range;
      const data = this.data as Array<CaseCountCapitalised>;
      this.$root.$emit("changeDates", {
        range: this.range,
        from: data[from].Date,
        to: data[to].Date,
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

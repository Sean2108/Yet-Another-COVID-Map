import Vue from "vue";
import _ from "lodash";
import { CaseCountRaw, DataTypes } from "@/types";

interface DropdownOption {
  text: string;
  value: DataTypes;
}

interface ComponentData {
  range: Array<number>;
  max: number;
  type: DataTypes;
  items: Array<DropdownOption>;
  typeSelection: DropdownOption;
}

export default Vue.extend({
  data: (): ComponentData => ({
    range: [0, 0],
    max: 0,
    type: DataTypes.CONFIRMED,
    items: [
      { text: "Confirmed cases", value: DataTypes.CONFIRMED },
      { text: "Deaths", value: DataTypes.DEATHS },
      { text: "Recoveries", value: DataTypes.RECOVERIES },
    ],
    typeSelection: {
      text: "Confirmed cases",
      value: DataTypes.CONFIRMED,
    },
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
    changeType(type: DataTypes) {
      this.type = type;
      this.$root.$emit("changeType", type);
    },
  },
  computed: {
    from(): string {
      const data = this.data as Array<CaseCountRaw>;
      const [from] = this.range;
      return data[from].date;
    },
    to(): string {
      const data = this.data as Array<CaseCountRaw>;
      const [, to] = this.range;
      return data[to].date;
    },
    typeText(): string {
      switch (this.type) {
        case DataTypes.CONFIRMED:
          return "Confirmed cases";
        case DataTypes.DEATHS:
          return "Deaths";
        case DataTypes.RECOVERIES:
          return "Recoveries";
      }
      return "";
    },
  },
});

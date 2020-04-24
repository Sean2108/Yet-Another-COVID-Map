import Vue from "vue";
import { fetchData, getThreshold, getRatiosArray } from "../../utils";
import {
  Endpoints,
  DataTypes,
  AggCountryCaseCounts,
  TableRow,
  RatiosLookup,
} from "@/types";
import _ from "lodash";
import { DataTableHeader } from "vuetify";

interface ComponentData {
  headers: Array<DataTableHeader>;
  items: Array<TableRow>;
  ratioLookup: RatiosLookup;
  thresholds: {
    [type: string]: {
      firstThreshold: number;
      secondThreshold: number;
    };
  };
}

interface ThresholdResult {
  badResult: string;
  goodResult: string;
  avgResult: string;
}

export default Vue.extend({
  props: {
    width: String,
  },
  data: (): ComponentData => ({
    headers: [
      {
        text: "Country",
        align: "start",
        value: "country",
      },
      ...Object.values(DataTypes).map((type) => ({
        text: _.capitalize(type),
        value: type,
      })),
    ],
    items: [],
    ratioLookup: {},
    thresholds: {
      [DataTypes.DEATHS]: {
        firstThreshold: 0,
        secondThreshold: 0,
      },
      [DataTypes.RECOVERIES]: {
        firstThreshold: 0,
        secondThreshold: 0,
      },
    },
  }),
  created() {
    this.fetch("", "");
  },
  methods: {
    async fetch(from: string, to: string) {
      const response: AggCountryCaseCounts = await fetchData(
        Endpoints.CASES,
        from,
        to,
        "",
        true,
        false,
        false
      );
      this.items = Object.entries(response).map(([country, info]) => ({
        country,
        ...info,
      }));
      if (this.items.length) {
        const ratios = getRatiosArray(this.items);
        this.ratioLookup = Object.fromEntries(ratios);
        this.thresholds = {
          [DataTypes.DEATHS]: getThreshold(ratios, DataTypes.DEATHS),
          [DataTypes.RECOVERIES]: getThreshold(ratios, DataTypes.RECOVERIES),
        };
      }
    },
    getColour(country: string, type: DataTypes): string {
      const ratio = this.ratioLookup[country][
        type === DataTypes.DEATHS ? "deathsRatio" : "recoveredRatio"
      ];
      return this.getThresholdInfo(
        type,
        ratio,
        {
          goodResult: "green",
          badResult: "red",
          avgResult: "orange",
        },
        (baseInfo: string) => `${baseInfo} darken-3`
      );
    },
    getTooltip(country: string, type: DataTypes): string {
      const ratio = this.ratioLookup[country][
        type === DataTypes.DEATHS ? "deathsRatio" : "recoveredRatio"
      ];
      return this.getThresholdInfo(
        type,
        ratio,
        {
          goodResult: "better than",
          badResult: "worse than",
          avgResult: "average compared to",
        },
        (baseInfo: string) =>
          `${country} has a ${
            type === DataTypes.DEATHS ? "fatality" : "recovery"
          } rate of ${Math.round(ratio * 100) /
            100}% which is ${baseInfo} other countries.`
      );
    },
    getThresholdInfo(
      type: DataTypes,
      ratio: number,
      options: ThresholdResult,
      callback: (baseInfo: string) => string
    ): string {
      const { firstThreshold, secondThreshold } = this.thresholds[type];
      let baseInfo;
      const { goodResult, badResult, avgResult } = options;
      if (
        (type === DataTypes.DEATHS && ratio < firstThreshold) ||
        (type === DataTypes.RECOVERIES && ratio >= secondThreshold)
      ) {
        baseInfo = goodResult;
      } else if (
        (type === DataTypes.DEATHS && ratio > secondThreshold) ||
        (type === DataTypes.RECOVERIES && ratio <= secondThreshold)
      ) {
        baseInfo = badResult;
      } else {
        baseInfo = avgResult;
      }
      return callback(baseInfo);
    },
  },
});

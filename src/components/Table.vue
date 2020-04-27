<template>
  <v-card v-if="items.length" dark raised :width="width">
    <v-card-title class="justify-center">
      <v-icon class="hidden-sm-and-down" large left>
        mdi-table-furniture
      </v-icon>
      <span
        :class="{
          title: $vuetify.breakpoint.mdAndUp,
          'subtitle-1': $vuetify.breakpoint.smAndDown,
          'font-weight-light': true
        }"
        >Country Data</span
      >
    </v-card-title>
    <v-card-subtitle class="py-0">
      <v-row>
        <v-col cols="8">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            dark
          />
        </v-col>
        <v-col cols="4"
          ><v-switch
            reverse
            dark
            v-model="showPercentages"
            label="Percentages"
            @change="updateShowPercentages"
        /></v-col>
      </v-row>
    </v-card-subtitle>
    <v-card-text>
      <v-data-table
        id="countryTable"
        :headers="headers"
        :items="items"
        class="elevation-1 transparent"
        dark
        :items-per-page="5"
        sort-by="confirmed"
        :sort-desc="true"
        no-data-text="Data unavailable"
        :footer-props="{ 'items-per-page-options': [5] }"
        :search="search"
        :mobile-breakpoint="0"
        must-sort
        :custom-sort="customSort"
        @click:row="emitRowClick"
      >
        <template v-slot:item.confirmed="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-chip
                :color="getColour(item.confirmedRatio, 'confirmed')"
                dark
                v-on="on"
                >{{
                  showPercentages
                    ? `${Math.round(item.confirmedRatio * 1000) / 1000}%`
                    : item.confirmed
                }}</v-chip
              >
            </template>
            <span>{{
              getTooltip(item.confirmedRatio, item.country, "confirmed")
            }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.deaths="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-chip
                :color="getColour(item.deathsRatio, 'deaths')"
                dark
                v-on="on"
                >{{
                  showPercentages
                    ? `${Math.round(item.deathsRatio * 100) / 100}%`
                    : item.deaths
                }}</v-chip
              >
            </template>
            <span>{{
              getTooltip(item.deathsRatio, item.country, "deaths")
            }}</span>
          </v-tooltip>
        </template>
        <template v-slot:item.recovered="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-chip
                :color="getColour(item.recoveredRatio, 'recovered')"
                dark
                v-on="on"
                >{{
                  showPercentages
                    ? `${Math.round(item.recoveredRatio * 100) / 100}%`
                    : item.recovered
                }}</v-chip
              >
            </template>
            <span>{{
              getTooltip(item.recoveredRatio, item.country, "recovered")
            }}</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { fetchData, getThreshold, getRatios } from "../utils";
import {
  Endpoints,
  DataTypes,
  AggCountryCaseCounts,
  CaseCountAggregatedWithRatios,
  CaseCountAggregatedWithLocation
} from "@/types";
import _ from "lodash";
import { DataTableHeader } from "vuetify";

interface ComponentData {
  headers: Array<DataTableHeader>;
  items: Array<CaseCountAggregatedWithRatios>;
  thresholds: {
    [type: string]: {
      firstThreshold: number;
      secondThreshold: number;
    };
  };
  search: string;
  showPercentages: boolean;
}

interface ThresholdResult {
  badResult: string;
  goodResult: string;
  avgResult: string;
}

export default Vue.extend({
  data: (): ComponentData => ({
    headers: [
      {
        text: "Country",
        align: "start",
        value: "country"
      },
      ...Object.values(DataTypes)
        .filter(type => type !== DataTypes.ACTIVE)
        .map(type => ({
          text: _.capitalize(type),
          value: type
        }))
    ],
    items: [],
    thresholds: {
      [DataTypes.CONFIRMED]: {
        firstThreshold: 0,
        secondThreshold: 0
      },
      [DataTypes.DEATHS]: {
        firstThreshold: 0,
        secondThreshold: 0
      },
      [DataTypes.RECOVERIES]: {
        firstThreshold: 0,
        secondThreshold: 0
      }
    },
    search: "",
    showPercentages: false
  }),
  props: {
    width: String
  },
  created() {
    this.fetch("", "");
  },
  mounted() {
    this.$root.$on(
      "changeDates",
      ({ from, to }: { from: string; to: string }) => this.fetch(from, to)
    );
  },
  methods: {
    updateShowPercentages(value: boolean) {
      this.$root.$emit("onChangeShowPercentages", value);
    },
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
      this.items = Object.values(response).map(getRatios);
      if (this.items.length) {
        this.thresholds = {
          [DataTypes.CONFIRMED]: getThreshold(this.items, DataTypes.CONFIRMED),
          [DataTypes.DEATHS]: getThreshold(this.items, DataTypes.DEATHS),
          [DataTypes.RECOVERIES]: getThreshold(this.items, DataTypes.RECOVERIES)
        };
      }
    },
    getColour(ratio: number, type: DataTypes): string {
      return this.getThresholdInfo(
        type,
        ratio,
        {
          goodResult: "green",
          badResult: "red",
          avgResult: "orange"
        },
        (baseInfo: string) => `${baseInfo} darken-3`
      );
    },
    getTooltip(ratio: number, country: string, type: DataTypes): string {
      return this.getThresholdInfo(
        type,
        ratio,
        {
          goodResult: "better than most",
          badResult: "worse than most",
          avgResult: "average compared to"
        },
        (baseInfo: string) =>
          `${country} has ${this.getRateType(type)} rate of ${Math.round(
            ratio * 100
          ) / 100}% which is ${baseInfo} other countries.`
      );
    },
    getRateType(type: DataTypes) {
      switch (type) {
        case DataTypes.CONFIRMED:
          return "an infection";
        case DataTypes.DEATHS:
          return "a fatality";
        case DataTypes.RECOVERIES:
        default:
          return "a recovery";
      }
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
        ((type === DataTypes.CONFIRMED || type === DataTypes.DEATHS) &&
          ratio < firstThreshold) ||
        (type === DataTypes.RECOVERIES && ratio >= secondThreshold)
      ) {
        baseInfo = goodResult;
      } else if (
        ((type === DataTypes.CONFIRMED || type === DataTypes.DEATHS) &&
          ratio > secondThreshold) ||
        (type === DataTypes.RECOVERIES && ratio <= secondThreshold)
      ) {
        baseInfo = badResult;
      } else {
        baseInfo = avgResult;
      }
      return callback(baseInfo);
    },
    customSort(
      items: Array<{ [key: string]: number }>,
      index: string,
      isDesc: Array<boolean>
    ) {
      const indexSuffix = this.showPercentages ? "Ratio" : "";
      items.sort((a, b) => {
        if (!isDesc[0]) {
          return a[`${index}${indexSuffix}`] < b[`${index}${indexSuffix}`]
            ? -1
            : 1;
        } else {
          return b[`${index}${indexSuffix}`] < a[`${index}${indexSuffix}`]
            ? -1
            : 1;
        }
      });
      return items;
    },
    emitRowClick(item: CaseCountAggregatedWithLocation) {
      this.$root.$emit("onRowClick", item);
    }
  }
});
</script>

<style>
#countryTable tbody tr:hover {
  cursor: pointer;
}
</style>

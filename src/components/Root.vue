<template>
  <v-container fluid v-resize="onResize">
    <v-overlay z-index="0" absolute :value="loading">
      <v-progress-circular
        indeterminate
        :size="70"
        :width="7"
        color="primary"
      />
    </v-overlay>
    <Map v-if="data.length" :worldData="data" />
    <Drawer v-if="data.length" :data="data" />
    <v-layout column fluid :class="scaleClass">
      <Filters
        v-if="data.length"
        class="card"
        :data="data"
        :width="overlayCardWidth"
      />
      <br />
      <Counter
        v-if="data.length"
        :data="counts"
        class="card"
        :width="overlayCardWidth"
      />
      <br />
      <Table class="card" :width="overlayCardWidth" />
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { fetchData, getRatios } from "../utils";
import Drawer from "./Drawer.vue";
import Map from "./Map.vue";
import Filters from "./Filters.vue";
import Counter from "./Counter.vue";
import Table from "./Table.vue";
import { Endpoints, DataTypes, CaseCountRaw } from "@/types";

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
      (response: any) => {
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
</script>

<style scoped>
.card {
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 2;
}
.small-scale-down {
  display: inline-block;
  transform: scale(0.35);
  transform-origin: top left;
}
.med-scale-down {
  display: inline-block;
  transform: scale(0.5);
  transform-origin: top left;
}
.large-scale-down {
  display: inline-block;
  transform: scale(0.65);
  transform-origin: top left;
}
</style>

<template>
  <v-app v-resize="onResize">
    <v-content>
      <v-container fluid>
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
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { fetchData } from "./utils";
import Drawer from "./components/Drawer/Drawer.vue";
import Map from "./components/Map/Map.vue";
import Filters from "./components/Filters/Filters.vue";
import Counter from "./components/Counter/Counter.vue";
import Table from "./components/Table/Table.vue";
import { Endpoints, DataTypes } from "@/types";

export default Vue.extend({
  components: {
    Drawer,
    Map,
    Filters,
    Counter,
    Table,
  },

  data: () => ({
    data: [],
    counts: {
      [DataTypes.CONFIRMED]: 0,
      [DataTypes.DEATHS]: 0,
      [DataTypes.RECOVERIES]: 0,
    },
    overlayCardWidth: "450px",
    scaleClass: "",
  }),
  created() {
    this.onResize();
    fetchData(Endpoints.CASES, "", "", "", false, false, true).then(
      (response) => {
        if (response) {
          this.data = response;
          this.counts = {
            [DataTypes.CONFIRMED]: response[response.length - 1].confirmed,
            [DataTypes.DEATHS]: response[response.length - 1].deaths,
            [DataTypes.RECOVERIES]: response[response.length - 1].recovered,
          };
        }
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
        "large-scale-down": [600, 900],
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
    },
  },
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

<template>
  <v-app>
    <v-content>
      <v-container>
        <Map v-if="data.length" :worldData="data" />
        <Drawer v-if="data.length" :data="data" />
        <Filters
          v-if="data.length"
          class="overlay"
          :data="data"
          :width="overlayCardWidth"
        />
        <Counter
          v-if="data.length"
          class="overlay"
          :data="counts"
          :width="overlayCardWidth"
        />
        <TablePanel class="overlay" :width="overlayCardWidth" />
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
import TablePanel from "./components/TablePanel/TablePanel.vue";
import { Endpoints, DataTypes } from "@/types";

export default Vue.extend({
  components: {
    Drawer,
    Map,
    Filters,
    Counter,
    TablePanel,
  },

  data: () => ({
    data: [],
    counts: {
      [DataTypes.CONFIRMED]: 0,
      [DataTypes.DEATHS]: 0,
      [DataTypes.RECOVERIES]: 0,
    },
  }),
  created() {
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
  computed: {
    overlayCardWidth() {
      return this.$vuetify.breakpoint.xlOnly
        ? "24vw"
        : this.$vuetify.breakpoint.lgOnly
        ? "30vw"
        : "40vw";
    },
  },
});
</script>

<style scoped>
.overlay {
  position: fixed;
  display: block;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 2;
  left: 10px;
}
</style>

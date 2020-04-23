<template>
  <v-app>
    <v-content>
      <v-container>
        <Map v-if="data.length" :worldData="data" />
        <Drawer v-if="data.length" :data="data" />
        <Filters v-if="data.length" :data="data" />
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
import { Endpoints } from "@/types";

export default Vue.extend({
  name: "App",

  components: {
    Drawer,
    Map,
    Filters,
  },

  data: () => ({
    data: [],
  }),
  created() {
    fetchData(Endpoints.CASES, "", "", "", false, false, true).then(
      (response) => (this.data = response || [])
    );
  },
});
</script>

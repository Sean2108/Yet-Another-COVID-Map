<template>
  <v-app>
    <v-content>
      <v-container>
        <Map v-if="data" :worldData="data" />
        <Drawer v-if="data" :data="data" />
        <Selections v-if="data" :data="data" />
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import { fetchData } from "./utils";
import Drawer from "./components/Drawer/Drawer.vue";
import Map from "./components/Map/Map.vue";
import Selections from "./components/Selections/Selections.vue";

export default Vue.extend({
  name: "App",

  components: {
    Drawer,
    Map,
    Selections,
  },

  data: () => ({
    data: null,
  }),
  async created() {
    this.data = await fetchData("cases", "", "", "", false, false, true);
  },
});
</script>

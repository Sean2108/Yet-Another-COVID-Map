<template>
  <v-app>
    <v-content>
      <v-container>
        <Map v-if="data.length" :worldData="data" />
        <Drawer v-if="data.length" :data="data" />
        <Selections v-if="data.length" :data="data" />
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
    data: [],
  }),
  created() {
    fetchData("cases", "", "", "", false, false, true).then(
      (response) => (this.data = response)
    );
  },
});
</script>

<template>
  <v-app>
    <v-content>
      <v-container>
        <Map />
        <Drawer />
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Drawer from "./components/Drawer/Drawer.vue";
import Map from "./components/Map/Map.vue";

export default Vue.extend({
  name: "App",

  components: {
    Drawer,
    Map
  },

  data: () => ({
    //
  }),
});
</script>

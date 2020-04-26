<template>
  <v-app>
    <v-content>
      <Root />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Root from "./components/Root/Root.vue";

export default Vue.extend({
  components: {
    Root
  }
});
</script>

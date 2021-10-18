<template>
  <v-card v-if="data" dark raised :width="width">
    <v-card-title class="justify-center">
      <div class="title font-weight-light">Total {{ header }}</div>
    </v-card-title>
    <v-card-subtitle class="display-2 text-center red--text font-weight-medium">
      {{ data[type].toLocaleString() }}
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { DataTypes } from "@/types";
import _ from "lodash";

export default Vue.extend({
  data: () => ({
    type: DataTypes.CONFIRMED
  }),
  props: {
    width: String,
    data: Object
  },
  mounted() {
    this.$root.$on("changeType", (type: DataTypes) => (this.type = type));
  },
  computed: {
    header(): string {
      return _.capitalize(this.type);
    }
  }
});
</script>

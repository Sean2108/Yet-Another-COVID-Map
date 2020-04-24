<template>
  <v-card
    class="hidden-lg-and-down"
    dark
    raised
    :width="width"
    style="top: 45vh"
  >
    <v-card-title class="justify-center">
      <v-icon large left>
        mdi-table
      </v-icon>
      <div class="title font-weight-light">Statistics by Country</div>
    </v-card-title>
    <v-card-text>
      <Table class="transparent" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Table from "../Table/Table.vue";

export default Vue.extend({
  components: {
    Table,
  },
  props: {
    width: String,
  },
});
</script>

<style>
transparent {
  opacity: 0;
}
</style>

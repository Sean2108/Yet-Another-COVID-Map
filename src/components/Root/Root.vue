<template>
  <v-container fluid v-resize="onResize">
    <v-overlay z-index="1" absolute :value="loading">
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

<script src="./Root.ts" />

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

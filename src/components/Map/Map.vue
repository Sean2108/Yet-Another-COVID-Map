<template>
  <div>
    <div id="map" />
    <v-overlay z-index="1" absolute :value="loading">
      <v-progress-circular
        indeterminate
        :size="70"
        :width="7"
        color="primary"
      />
    </v-overlay>
  </div>
</template>

<script src="./Map.ts" />

<style scoped>
body {
  margin: 0;
  padding: 0;
}
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
}
.v-progress-circular {
  margin: 1rem;
}
</style>

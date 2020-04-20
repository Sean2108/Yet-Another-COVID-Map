<template>
  <div id="map" />
</template>
<script>
import * as mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import { fetchData } from "../utils/Fetcher.ts";
export default {
  data() {
    return {
      data: null,
    };
  },
  created () {
    this.data = fetchData("cases", "", "", true, false);
  },
  mounted: () => {
    mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN;
    new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v10",
    });
  },
};
</script>
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
</style>

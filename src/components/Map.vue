<template>
  <div id="map" />
</template>
<script>
import * as mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
export default {
  mounted: () => {
    mapboxgl.accessToken =
      "pk.eyJ1Ijoic2VhbjIxMDgiLCJhIjoiY2psbmo5Z3p0MGJ5NTN3czFnNWNwdHY5MyJ9.6ZeKBCi2Pv8bXTYDMEKErw";
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

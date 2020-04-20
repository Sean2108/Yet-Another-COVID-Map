<template>
  <div id="map" />
</template>
<script>
import * as mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import {
  fetchData,
  convertDataToGeoJson,
  drawLayer,
  getMapPaintObj,
} from "../utils.ts";

const FIRST_CONFIRMED_THRESHOLD = 100000;
const SECOND_CONFIRMED_THRESHOLD = 200000;

const FIRST_DEATHS_THRESHOLD = 10000;
const SECOND_DEATHS_THRESHOLD = 20000;

export default {
  data() {
    return {
      data: null,
    };
  },
  async mounted() {
    this.data = await fetchData("cases", "", "", "", false, false, false);
    mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN;
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v10",
      minZoom: 1,
      maxZoom: 7,
    });

    this.$root.$on("changeShowConfirmed", (getConfirmed) => {
      const firstThreshold = getConfirmed
        ? FIRST_CONFIRMED_THRESHOLD
        : FIRST_DEATHS_THRESHOLD;
      const secondThreshold = getConfirmed
        ? SECOND_CONFIRMED_THRESHOLD
        : SECOND_DEATHS_THRESHOLD;
      map
        .getSource("cases")
        .setData(convertDataToGeoJson(this.data, getConfirmed));
      let paintObj = getMapPaintObj(true, firstThreshold, secondThreshold);
      map.setPaintProperty(
        "clusters",
        "circle-color",
        paintObj["circle-color"]
      );
      map.setPaintProperty(
        "clusters",
        "circle-radius",
        paintObj["circle-radius"]
      );
      paintObj = getMapPaintObj(false, firstThreshold, secondThreshold);
      map.setPaintProperty(
        "non-clusters",
        "circle-color",
        paintObj["circle-color"]
      );
      map.setPaintProperty(
        "non-clusters",
        "circle-radius",
        paintObj["circle-radius"]
      );
    });

    map.on("load", () => {
      map.addSource("cases", {
        type: "geojson",
        data: convertDataToGeoJson(this.data, true),
        cluster: true,
        clusterProperties: {
          sum: ["+", ["get", "value"]],
        },
      });

      drawLayer(
        map,
        true,
        FIRST_CONFIRMED_THRESHOLD,
        SECOND_CONFIRMED_THRESHOLD
      );
      drawLayer(
        map,
        false,
        FIRST_CONFIRMED_THRESHOLD,
        SECOND_CONFIRMED_THRESHOLD
      );

      map.on("click", "clusters", function(e) {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0].properties.cluster_id;
        map
          .getSource("cases")
          .getClusterExpansionZoom(clusterId, function(err, zoom) {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
      });

      map.on("click", "non-clusters", (e) => {
        this.$root.$emit("countrySelected", e.features[0].properties.country);
      });

      map.on("mouseenter", "clusters", function() {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", function() {
        map.getCanvas().style.cursor = "";
      });
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

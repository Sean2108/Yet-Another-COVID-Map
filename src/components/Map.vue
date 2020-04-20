<template>
  <div id="map" />
</template>
<script>
import * as mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import { fetchData, convertDataToGeoJson } from "../utils.ts";

const FIRST_CONFIRMED_THRESHOLD = 100000;
const SECOND_CONFIRMED_THRESHOLD = 200000;

const FIRST_DEATHS_THRESHOLD = 10000;
const SECOND_DEATHS_THRESHOLD = 20000;

export default {
  data() {
    return {
      data: null,
      getConfirmed: true,
    };
  },
  async mounted() {
    this.data = await fetchData("cases", "", "", false, false);
    mapboxgl.accessToken = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN;
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v10",
    });

    map.on("load", () => {
      map.addSource("cases", {
        type: "geojson",
        data: convertDataToGeoJson(this.data, this.getConfirmed),
        cluster: true,
        clusterProperties: {
          sum: ["+", ["get", "value"]],
        },
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "cases",
        filter: ["has", "sum"],
        paint: {
          "circle-color": [
            "step",
            ["get", "sum"],
            "#51bbd6",
            this.getConfirmed
              ? FIRST_CONFIRMED_THRESHOLD
              : FIRST_DEATHS_THRESHOLD,
            "#f1f075",
            this.getConfirmed
              ? SECOND_CONFIRMED_THRESHOLD
              : SECOND_DEATHS_THRESHOLD,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "sum"],
            20,
            this.getConfirmed
              ? FIRST_CONFIRMED_THRESHOLD
              : FIRST_DEATHS_THRESHOLD,
            30,
            this.getConfirmed
              ? SECOND_CONFIRMED_THRESHOLD
              : SECOND_DEATHS_THRESHOLD,
            40,
          ],
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "cases",
        filter: ["has", "sum"],
        layout: {
          "text-field": "{sum}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      map.addLayer({
        id: "non-clusters",
        type: "circle",
        source: "cases",
        filter: ["!", ["has", "sum"]],
        paint: {
          "circle-color": [
            "step",
            ["get", "value"],
            "#51bbd6",
            this.getConfirmed
              ? FIRST_CONFIRMED_THRESHOLD
              : FIRST_DEATHS_THRESHOLD,
            "#f1f075",
            this.getConfirmed
              ? SECOND_CONFIRMED_THRESHOLD
              : SECOND_DEATHS_THRESHOLD,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "value"],
            20,
            this.getConfirmed
              ? FIRST_CONFIRMED_THRESHOLD
              : FIRST_DEATHS_THRESHOLD,
            30,
            this.getConfirmed
              ? SECOND_CONFIRMED_THRESHOLD
              : SECOND_DEATHS_THRESHOLD,
            40,
          ],
        },
      });

      map.addLayer({
        id: "points",
        type: "symbol",
        source: "cases",
        filter: ["!", ["has", "sum"]],
        layout: {
          "text-field": ["get", "value"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

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

      map.on("click", "non-clusters", function(e) {
        console.log(e.features[0].properties.country);
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

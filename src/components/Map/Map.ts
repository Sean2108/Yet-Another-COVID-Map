import * as mapboxgl from "mapbox-gl";
import Vue from "vue";
import {
  fetchData,
  convertDataToGeoJson,
  drawLayer,
  getMapPaintObj,
} from "../../utils";
import { CaseCounts, GeoJsonFeature } from "@/types";

const FIRST_CONFIRMED_THRESHOLD = 100000;
const SECOND_CONFIRMED_THRESHOLD = 200000;

const FIRST_DEATHS_THRESHOLD = 10000;
const SECOND_DEATHS_THRESHOLD = 20000;

interface ComponentData {
  data: CaseCounts | null;
  getConfirmed: boolean;
}

export default Vue.extend({
  data(): ComponentData {
    return {
      data: null,
      getConfirmed: true,
    };
  },
  async mounted() {
    this.data = await fetchData("cases", "", "", "", false, false, false);
    (mapboxgl as any).accessToken = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN;
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v10",
      minZoom: 1,
      maxZoom: 7,
    });

    this.$root.$on(
      "changeDates",
      async ({ from, to }: { from: string; to: string }) => {
        const data = await fetchData(
          "cases",
          from,
          to,
          "",
          false,
          false,
          false
        );
        this.data = data;
        (map.getSource("cases") as mapboxgl.GeoJSONSource).setData(
          convertDataToGeoJson(data, this.getConfirmed) as any
        );
      }
    );

    this.$root.$on("changeShowConfirmed", (getConfirmed: boolean) => {
      const firstThreshold = getConfirmed
        ? FIRST_CONFIRMED_THRESHOLD
        : FIRST_DEATHS_THRESHOLD;
      const secondThreshold = getConfirmed
        ? SECOND_CONFIRMED_THRESHOLD
        : SECOND_DEATHS_THRESHOLD;
      this.getConfirmed = getConfirmed;
      const data = this.data;
      if (!data) {
        return;
      }
      (map.getSource("cases") as mapboxgl.GeoJSONSource).setData(
        convertDataToGeoJson(data, getConfirmed) as any
      );
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
      const data = this.data;
      if (!data) {
        return;
      }
      map.addSource("cases", {
        type: "geojson",
        data: convertDataToGeoJson(data, true) as any,
        cluster: true,
        clusterProperties: {
          sum: ["+", ["get", "value"]],
        },
      } as any);

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

      map.on("click", "clusters", function(e: any) {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });
        const clusterId = features[0]?.properties?.cluster_id;
        (map.getSource(
          "cases"
        ) as mapboxgl.GeoJSONSource).getClusterExpansionZoom(
          clusterId,
          function(err: any, zoom: any) {
            if (err) return;

            map.easeTo({
              center: (features[0].geometry as any).coordinates,
              zoom,
            });
          }
        );
      });

      map.on("click", "non-clusters", (e) => {
        if (e && e.features && e.features[0].properties) {
          this.$root.$emit("countrySelected", e.features[0].properties.country);
        }
      });

      map.on("mouseenter", "clusters", function() {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "clusters", function() {
        map.getCanvas().style.cursor = "";
      });
    });
  },
});

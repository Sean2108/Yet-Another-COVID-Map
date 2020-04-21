import * as mapboxgl from "mapbox-gl";
import Vue from "vue";
import { fetchData, convertDataToGeoJson } from "../../utils";
import { CaseCounts } from "@/types";
import Vuetify from "vuetify/lib";
import StateInfo from "../StateInfo/StateInfo.vue";

const FIRST_CONFIRMED_THRESHOLD = 100000;
const SECOND_CONFIRMED_THRESHOLD = 200000;

const FIRST_DEATHS_THRESHOLD = 10000;
const SECOND_DEATHS_THRESHOLD = 20000;

const INITIAL_ZOOM = 2;
const MIN_ZOOM = 1;
const MAX_ZOOM = 7;

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
  methods: {
    onChangeDates: async function(
      map: mapboxgl.Map,
      { from, to }: { from: string; to: string }
    ) {
      const data = await fetchData("cases", from, to, "", false, false, false);
      this.data = data;
      (map.getSource("cases") as mapboxgl.GeoJSONSource).setData(
        convertDataToGeoJson(data, this.getConfirmed) as any
      );
    },
    onChangeShowConfirmed: function(map: mapboxgl.Map, getConfirmed: boolean) {
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
      let paintObj = this.getMapPaintObj(true, firstThreshold, secondThreshold);
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
      paintObj = this.getMapPaintObj(false, firstThreshold, secondThreshold);
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
    },
    setupMouseEnterAndLeave(map: mapboxgl.Map, layerName: string) {
      map.on("mouseenter", layerName, function() {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", layerName, function() {
        map.getCanvas().style.cursor = "";
      });
    },
    drawLayer(
      map: mapboxgl.Map,
      isCluster: boolean,
      firstThreshold: number,
      secondThreshold: number
    ) {
      const id = isCluster ? "clusters" : "non-clusters";
      const filter = isCluster ? ["has", "sum"] : ["!", ["has", "sum"]];
      map.addLayer({
        id,
        type: "circle",
        source: "cases",
        filter,
        paint: this.getMapPaintObj(isCluster, firstThreshold, secondThreshold),
      });

      map.addLayer({
        id: `${id}-count`,
        type: "symbol",
        source: "cases",
        filter,
        layout: {
          "text-field": isCluster ? "{sum}" : ["get", "value"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });
    },
    getMapPaintObj(
      isCluster: boolean,
      firstThreshold: number,
      secondThreshold: number
    ): mapboxgl.CirclePaint {
      const prop = isCluster ? "sum" : "value";
      return {
        "circle-color": [
          "step",
          ["get", prop],
          "#51bbd6",
          firstThreshold,
          "#f1f075",
          secondThreshold,
          "#f28cb1",
        ],
        "circle-radius": [
          "step",
          ["get", prop],
          20,
          firstThreshold,
          30,
          secondThreshold,
          40,
        ],
      };
    },
    setupMap(map: mapboxgl.Map) {
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

      this.drawLayer(
        map,
        true,
        FIRST_CONFIRMED_THRESHOLD,
        SECOND_CONFIRMED_THRESHOLD
      );
      this.drawLayer(
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
        if (e && e.features && e.features[0] && e.features[0].properties) {
          const coordinates = (e.features[0]
            .geometry as any).coordinates.slice();
          const properties = e.features[0].properties;
          const { country, state } = properties;
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          const info = new StateInfo({
            vuetify: new Vuetify(),
            propsData: {
              country,
              state,
            },
          }).$mount();
          if (info) {
            new mapboxgl.Popup({
              closeButton: false,
              maxWidth: "400px",
              className: "popup",
            })
              .setLngLat(coordinates)
              .setDOMContent(info.$el)
              .addTo(map);
          }
        }
      });
      this.setupMouseEnterAndLeave(map, "clusters");
      this.setupMouseEnterAndLeave(map, "non-clusters");
    },
  },
  async mounted() {
    this.data = await fetchData("cases", "", "", "", false, false, false);
    (mapboxgl as any).accessToken = process.env.VUE_APP_MAPBOX_ACCESS_TOKEN;
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/dark-v10",
      center: [0, 30],
      zoom: INITIAL_ZOOM,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      attributionControl: false,
    }).addControl(
      new mapboxgl.AttributionControl({
        customAttribution: [
          '<a href="https://github.com/Sean2108">© Sean Tan</a>',
          '<a href="https://newsapi.org">© NewsAPI.org</a>',
        ],
      })
    );

    this.$root.$on("changeDates", (obj: { from: string; to: string }) =>
      this.onChangeDates(map, obj)
    );

    this.$root.$on("changeShowConfirmed", (getConfirmed: boolean) =>
      this.onChangeShowConfirmed(map, getConfirmed)
    );

    map.on("load", () => this.setupMap(map));
  },
});

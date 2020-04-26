import * as mapboxgl from "mapbox-gl";
import Vue from "vue";
import { fetchData, convertDataToGeoJson } from "../../utils";
import { CaseCounts, CaseCountRaw, DataTypes, Endpoints } from "@/types";
import Vuetify from "vuetify/lib";
import StateInfo from "../StateInfo/StateInfo.vue";

// below thresholds are expressed as a fraction of the world total between the given dates
const FIRST_THRESHOLD = 0.01;
const SECOND_THRESHOLD = 0.1;
const THIRD_THRESHOLD = 0.3;

const INITIAL_ZOOM = 2;
const MIN_ZOOM = 1;
const MAX_ZOOM = 7;

interface ComponentData {
  data: CaseCounts;
  type: DataTypes;
  range: Array<number>;
  firstThreshold: number;
  secondThreshold: number;
  thirdThreshold: number;
  loaded: boolean;
}

export default Vue.extend({
  data(): ComponentData {
    return {
      data: {},
      type: DataTypes.CONFIRMED,
      range: [0, 0],
      firstThreshold: 100000,
      secondThreshold: 200000,
      thirdThreshold: 300000,
      loaded: false,
    };
  },
  props: {
    worldData: Array,
  },
  methods: {
    setThresholds: function(
      data: Array<CaseCountRaw>,
      [from, to]: Array<number>
    ) {
      const confirmed =
        data[to].confirmed - (from > 0 ? data[from - 1].confirmed : 0);
      const deaths = data[to].deaths - (from > 0 ? data[from - 1].deaths : 0);
      const recovered =
        data[to].recovered - (from > 0 ? data[from - 1].recovered : 0);
      const globalVal =
        this.type === DataTypes.CONFIRMED
          ? confirmed
          : this.type === DataTypes.DEATHS
          ? deaths
          : recovered;
      this.firstThreshold = globalVal * FIRST_THRESHOLD;
      this.secondThreshold = globalVal * SECOND_THRESHOLD;
      this.thirdThreshold = globalVal * THIRD_THRESHOLD;
    },
    paintThreshold: function(map: mapboxgl.Map, isCluster: boolean) {
      const id = `${isCluster ? "" : "non-"}clusters`;
      const paintObj = this.getMapPaintObj(
        isCluster,
        this.firstThreshold,
        this.secondThreshold,
        this.thirdThreshold
      );
      map.setPaintProperty(id, "circle-color", paintObj["circle-color"]);
      map.setPaintProperty(id, "circle-radius", paintObj["circle-radius"]);
    },
    paintThresholds: function(map: mapboxgl.Map) {
      this.paintThreshold(map, true);
      this.paintThreshold(map, false);
    },
    onChangeDates: async function(
      map: mapboxgl.Map,
      { from, to, range }: { from: string; to: string; range: Array<number> }
    ) {
      this.$root.$emit("setLoading", true);
      const data =
        (await fetchData(Endpoints.CASES, from, to, "", false, false, false)) ||
        [];
      this.range = range;
      this.setThresholds(this.worldData as Array<CaseCountRaw>, range);
      this.data = data;
      (map.getSource("cases") as mapboxgl.GeoJSONSource).setData(
        convertDataToGeoJson(data, this.type) as any
      );
      this.paintThresholds(map);
      this.$root.$emit("setLoading", false);
    },
    onChangeType: function(map: mapboxgl.Map, type: DataTypes) {
      this.$root.$emit("setLoading", true);
      this.type = type;
      const data = this.data;
      if (!data) {
        return;
      }
      (map.getSource("cases") as mapboxgl.GeoJSONSource).setData(
        convertDataToGeoJson(data, type) as any
      );
      this.setThresholds(this.worldData as Array<CaseCountRaw>, this.range);
      this.paintThresholds(map);
      this.$root.$emit("setLoading", false);
    },
    setupMouseEnterAndLeave(map: mapboxgl.Map, layerName: string) {
      map.on("mouseenter", layerName, function() {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", layerName, function() {
        map.getCanvas().style.cursor = "";
      });
    },
    drawLayer(map: mapboxgl.Map, isCluster: boolean) {
      const id = isCluster ? "clusters" : "non-clusters";
      const filter = isCluster
        ? ["all", ["has", "sum"], ["!=", "sum", 0]]
        : ["all", ["!", ["has", "sum"]], ["!=", ["get", "value"], 0]];
      map.addLayer({
        id,
        type: "circle",
        source: "cases",
        filter,
        paint: this.getMapPaintObj(
          isCluster,
          this.firstThreshold,
          this.secondThreshold,
          this.thirdThreshold
        ),
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
      secondThreshold: number,
      thirdThreshold: number
    ): mapboxgl.CirclePaint {
      const prop = isCluster ? "sum" : "value";
      return {
        "circle-color": [
          "interpolate",
          ["linear"],
          ["get", prop],
          0,
          "#33FF73",
          firstThreshold,
          "#51bbd6",
          secondThreshold,
          "#f1f075",
          thirdThreshold,
          "#f28cb1",
        ],
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["get", prop],
          0,
          15,
          firstThreshold,
          20,
          secondThreshold,
          30,
          thirdThreshold,
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
        data: convertDataToGeoJson(data, this.type),
        cluster: true,
        clusterProperties: {
          sum: ["+", ["get", "value"]],
        },
      } as any);

      this.drawLayer(map, true);
      this.drawLayer(map, false);

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
          const { iso, country, state } = properties;
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          const info = new StateInfo({
            vuetify: new Vuetify(),
            propsData: {
              country,
              iso,
              state,
            },
          }).$mount();
          if (info) {
            new mapboxgl.Popup({
              closeButton: false,
              maxWidth: this.getPopupWidth(),
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
      this.$root.$emit("setLoading", false);
      this.loaded = true;
    },
    getPopupWidth(): string {
      if (this.$vuetify.breakpoint.xlOnly) {
        return "25vw";
      }
      if (this.$vuetify.breakpoint.smAndDown) {
        return "40vw";
      }
      return "35vw";
    },
    execAfterLoaded(cb: () => void, wait: number): void {
      if (!this.loaded) {
        window.setTimeout(() => this.execAfterLoaded(cb, wait), wait);
      } else {
        cb();
      }
    },
  },
  async mounted() {
    this.$root.$emit("setLoading", true);
    this.range = [0, this.worldData.length - 1];
    this.setThresholds(this.worldData as Array<CaseCountRaw>, [
      0,
      this.worldData.length - 1,
    ]);
    this.data =
      (await fetchData(Endpoints.CASES, "", "", "", false, false, false)) || [];
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

    this.$root.$on(
      "changeDates",
      (obj: { from: string; to: string; range: Array<number> }) =>
        this.execAfterLoaded(() => this.onChangeDates(map, obj), 100)
    );

    this.$root.$on("changeType", (type: DataTypes) =>
      this.execAfterLoaded(() => this.onChangeType(map, type), 100)
    );

    map.on("load", () => this.setupMap(map));
  },
});

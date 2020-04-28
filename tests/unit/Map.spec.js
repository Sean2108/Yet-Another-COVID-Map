import { mount, createLocalVue, createWrapper } from "@vue/test-utils";
import Map from "../../src/components/Map.vue";
import Vuetify from "vuetify";
import * as utils from "../../src/utils";

utils.fetchData = jest.fn();

describe("Map.vue", () => {
  const sourceMock = {
    setData: jest.fn(),
    getClusterExpansionZoom: jest.fn()
  };

  const mapMock = {
    easeTo: jest.fn(),
    getSource: jest.fn().mockReturnValue(sourceMock),
    setPaintProperty: jest.fn(),
    addSource: jest.fn(),
    addLayer: jest.fn(),
    on: jest.fn(),
    queryRenderedFeatures: jest
      .fn()
      .mockReturnValue([{ properties: { cluster_id: 123 } }]) // eslint-disable-line @typescript-eslint/camelcase
  };

  let localVue, wrapper;
  const worldData = [
    { date: "2/1/20", confirmed: 200000, deaths: 50000, recovered: 100000 },
    { date: "2/2/20", confirmed: 500000, deaths: 150000, recovered: 250000 },
    { date: "2/3/20", confirmed: 750000, deaths: 150000, recovered: 400000 }
  ];

  function getColourPaintProperty(value, thresholds, reversed) {
    return [
      "interpolate",
      ["linear"],
      ["get", value],
      0,
      reversed ? "red" : "lime",
      thresholds[0],
      reversed ? "orange" : "yellow",
      thresholds[1],
      reversed ? "yellow" : "orange",
      thresholds[2],
      reversed ? "lime" : "red"
    ];
  }

  function getRadiusPaintProperty(value, thresholds) {
    return [
      "interpolate",
      ["linear"],
      ["get", value],
      0,
      15,
      thresholds[0],
      25,
      thresholds[1],
      35,
      thresholds[2],
      40
    ];
  }

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuetify);
    wrapper = mount(Map, {
      localVue,
      propsData: {
        worldData
      }
    });
    wrapper.vm.$data.loaded = true;
    wrapper.vm.setupMapListeners(mapMock);
  });

  it("should set threshold correctly", () => {
    wrapper.vm.setThresholds(worldData, [0, 2]);
    expect(wrapper.vm.$data.thresholds).toEqual([0, 750, 75000, 225000]);
  });

  it("should paint thresholds when changeType to deaths event is emitted", async () => {
    wrapper.vm.$root.$emit("changeType", "deaths");
    await localVue.nextTick();
    const rootWrapper = createWrapper(wrapper.vm.$root);
    expect(rootWrapper.emitted().setLoading).toHaveLength(3);
    expect(rootWrapper.emitted().setLoading).toEqual([[true], [true], [false]]);
    expect(mapMock.setPaintProperty).toHaveBeenCalledWith(
      "clusters",
      "circle-color",
      getColourPaintProperty("sum", [150, 15000, 45000], false)
    );
    expect(mapMock.setPaintProperty).toHaveBeenCalledWith(
      "clusters",
      "circle-radius",
      getRadiusPaintProperty("sum", [150, 15000, 45000])
    );
    expect(mapMock.setPaintProperty).toHaveBeenCalledWith(
      "non-clusters",
      "circle-color",
      getColourPaintProperty("value", [150, 15000, 45000], false)
    );
    expect(mapMock.setPaintProperty).toHaveBeenCalledWith(
      "non-clusters",
      "circle-radius",
      getRadiusPaintProperty("value", [150, 15000, 45000])
    );
  });

  it("should paint thresholds when changeType to recovered event is emitted", async () => {
    wrapper.vm.$root.$emit("changeType", "recovered");
    await localVue.nextTick();
    const rootWrapper = createWrapper(wrapper.vm.$root);
    expect(rootWrapper.emitted().setLoading).toHaveLength(3);
    expect(rootWrapper.emitted().setLoading).toEqual([[true], [true], [false]]);
    expect(mapMock.setPaintProperty).toHaveBeenCalledWith(
      "clusters",
      "circle-color",
      getColourPaintProperty("sum", [400, 40000, 120000], true)
    );
    expect(mapMock.setPaintProperty).toHaveBeenCalledWith(
      "clusters",
      "circle-radius",
      getRadiusPaintProperty("sum", [400, 40000, 120000])
    );
    expect(mapMock.setPaintProperty).toHaveBeenCalledWith(
      "non-clusters",
      "circle-color",
      getColourPaintProperty("value", [400, 40000, 120000], true)
    );
    expect(mapMock.setPaintProperty).toHaveBeenCalledWith(
      "non-clusters",
      "circle-radius",
      getRadiusPaintProperty("value", [400, 40000, 120000])
    );
  });

  it("should paint thresholds when changeDates event is emitted", async () => {
    wrapper.vm.$root.$emit("changeDates", {
      from: "2/2/20",
      to: "2/3/20",
      range: [1, 2]
    });
    await localVue.nextTick();
    const rootWrapper = createWrapper(wrapper.vm.$root);
    expect(rootWrapper.emitted().setLoading).toHaveLength(3);
    expect(rootWrapper.emitted().setLoading).toEqual([[true], [true], [false]]);
    expect(mapMock.setPaintProperty).toHaveBeenCalledWith(
      "clusters",
      "circle-color",
      getColourPaintProperty("sum", [550, 55000, 165000], false)
    );
    expect(mapMock.setPaintProperty).toHaveBeenCalledWith(
      "clusters",
      "circle-radius",
      getRadiusPaintProperty("sum", [550, 55000, 165000])
    );
    expect(mapMock.setPaintProperty).toHaveBeenCalledWith(
      "non-clusters",
      "circle-color",
      getColourPaintProperty("value", [550, 55000, 165000], false)
    );
    expect(mapMock.setPaintProperty).toHaveBeenCalledWith(
      "non-clusters",
      "circle-radius",
      getRadiusPaintProperty("value", [550, 55000, 165000])
    );
  });

  it("should zoom to lat long after onRowClick event is emitted", async () => {
    wrapper.vm.$root.$emit("onRowClick", {
      lat: 10,
      long: 20
    });
    await localVue.nextTick();
    expect(mapMock.easeTo).toHaveBeenCalledWith({
      center: { lat: 10, lon: 20 },
      zoom: 4
    });
  });

  it("should execAfterLoaded correctly", async () => {
    wrapper.vm.$data.loaded = false;
    await localVue.nextTick();
    const cb = jest.fn();
    wrapper.vm.execAfterLoaded(cb, 10);
    expect(cb).not.toHaveBeenCalled();
    wrapper.vm.$data.loaded = true;
    await localVue.nextTick();
    setTimeout(() => expect(cb).toHaveBeenCalledTimes(1), 10);
  });

  it("should not setupMap if data is null", () => {
    wrapper.vm.$data.data = null;
    wrapper.vm.setupMap(mapMock);
    expect(mapMock.addSource).not.toHaveBeenCalled();
  });

  it("should setupMap correctly", () => {
    wrapper.vm.setupMap(mapMock);
    expect(mapMock.addSource).toHaveBeenCalled();
    expect(mapMock.addLayer).toHaveBeenCalledWith({
      id: "clusters",
      type: "circle",
      source: "cases",
      filter: ["all", ["has", "sum"], ["!=", "sum", 0]],
      paint: {
        "circle-color": getColourPaintProperty(
          "sum",
          [750, 75000, 225000],
          false
        ),
        "circle-radius": getRadiusPaintProperty("sum", [750, 75000, 225000])
      }
    });
    expect(mapMock.addLayer).toHaveBeenCalledWith({
      id: "clusters-count",
      type: "symbol",
      source: "cases",
      filter: ["all", ["has", "sum"], ["!=", "sum", 0]],
      layout: {
        "text-field": "{sum}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12
      }
    });
    expect(mapMock.addLayer).toHaveBeenCalledWith({
      id: "non-clusters",
      type: "circle",
      source: "cases",
      filter: ["all", ["!", ["has", "sum"]], ["!=", ["get", "value"], 0]],
      paint: {
        "circle-color": getColourPaintProperty(
          "value",
          [750, 75000, 225000],
          false
        ),
        "circle-radius": getRadiusPaintProperty("value", [750, 75000, 225000])
      }
    });
    expect(mapMock.addLayer).toHaveBeenCalledWith({
      id: "non-clusters-count",
      type: "symbol",
      source: "cases",
      filter: ["all", ["!", ["has", "sum"]], ["!=", ["get", "value"], 0]],
      layout: {
        "text-field": ["get", "value"],
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12
      }
    });
    expect(mapMock.on).toHaveBeenCalledWith(
      "click",
      "clusters",
      expect.any(Function)
    );
    expect(mapMock.on).toHaveBeenCalledWith(
      "click",
      "non-clusters",
      expect.any(Function)
    );
    const rootWrapper = createWrapper(wrapper.vm.$root);
    expect(rootWrapper.emitted().setLoading).toHaveLength(2);
    expect(rootWrapper.emitted().setLoading).toEqual([[true], [false]]);
    expect(wrapper.vm.$data.loaded).toBe(true);
  });

  it("should have correct popup width", () => {
    wrapper.vm.$vuetify = { breakpoint: { xlOnly: true, smAndDown: false } };
    expect(wrapper.vm.getPopupWidth()).toEqual("25vw");
    wrapper.vm.$vuetify = { breakpoint: { xlOnly: false, smAndDown: true } };
    expect(wrapper.vm.getPopupWidth()).toEqual("40vw");
    wrapper.vm.$vuetify = { breakpoint: { xlOnly: false, smAndDown: false } };
    expect(wrapper.vm.getPopupWidth()).toEqual("35vw");
  });

  it("should call getClusterExpansionZoom when onClickClusters is called", () => {
    wrapper.vm.onClickClusters({ point: [5, 10] }, mapMock);
    expect(mapMock.queryRenderedFeatures).toHaveBeenCalledWith([5, 10], {
      layers: ["clusters"]
    });
    expect(sourceMock.getClusterExpansionZoom).toHaveBeenCalledWith(
      123,
      expect.any(Function)
    );
  });
});

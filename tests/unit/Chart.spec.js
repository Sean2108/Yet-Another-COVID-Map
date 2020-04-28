import { shallowMount, createLocalVue } from "@vue/test-utils";
import Chart from "../../src/components/Chart.vue";
import * as d3 from "d3";
import Vuetify from "vuetify";
import * as utils from "../../src/utils";

utils.fetchData = jest.fn();

describe("Chart.vue", () => {
  let localVue, wrapper;
  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuetify);

    wrapper = shallowMount(Chart, {
      localVue,
      attachToDocument: true,
      propsData: {
        id: "testChart",
        chartData: [
          { date: "2/1/20", confirmed: 20, deaths: 5, recovered: 10 },
          { date: "2/2/20", confirmed: 50, deaths: 15, recovered: 25 },
          { date: "2/3/20", confirmed: 75, deaths: 15, recovered: 40 }
        ],
        width: 150,
        height: 100,
        legendX: 120,
        legendY: 50,
        marginLeft: 30,
        marginRight: 50,
        showPercentages: false
      }
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("should draw graph correctly", () => {
    expect(d3.select("svg")).not.toBeNull();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  it("should update graph on data update", async () => {
    wrapper.setProps({
      chartData: [
        { date: "2/1/20", confirmed: 25, deaths: 10, recovered: 15 },
        { date: "2/2/20", confirmed: 55, deaths: 10, recovered: 35 },
        { date: "2/3/20", confirmed: 80, deaths: 20, recovered: 60 }
      ]
    });
    await localVue.nextTick();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  it("should update graph on showPercentages update", async () => {
    wrapper.setProps({
      showPercentages: true
    });
    await localVue.nextTick();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });

  it("should alter svg correctly on mouse actions", async () => {
    wrapper.vm.onMouseEnter(d3.select("svg"), "red");
    await localVue.nextTick();
    expect(wrapper.vm.$el).toMatchSnapshot();
    wrapper.vm.onMouseLeave(d3.select("svg"), "red");
    await localVue.nextTick();
    expect(wrapper.vm.$el).toMatchSnapshot();
  });
});

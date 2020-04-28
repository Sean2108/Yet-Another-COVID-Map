import { shallowMount, createLocalVue } from "@vue/test-utils";
import Drawer from "../../src/components/Drawer.vue";
import Vuetify from "vuetify";

describe("Drawer.vue", () => {
  let localVue, wrapper;
  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuetify);
    wrapper = shallowMount(Drawer, {
      localVue,
      propsData: {
        worldData: [
          { confirmed: 20, deaths: 5, recovered: 10 },
          { confirmed: 50, deaths: 15, recovered: 25 },
          { confirmed: 75, deaths: 15, recovered: 40 }
        ]
      }
    });
  });

  it("should have correct initial value", () => {
    [
      { name: "getConfirmed", value: 75 },
      { name: "getDeaths", value: 15 },
      { name: "getRecoveries", value: 40 },
      { name: "getActive", value: 20 },
      { name: "getInfectionRate", value: 0 },
      { name: "getFatalityRate", value: 20 },
      { name: "getRecoveryRate", value: 53.33 }
    ].forEach(({ name, value }) => expect(wrapper.vm[name]).toEqual(value));
  });

  it("should change showPercentages when onChangeShowPercentages is emitted", async () => {
    expect(wrapper.vm.$data.showPercentages).toBe(false);
    wrapper.vm.$root.$emit("onChangeShowPercentages", true);
    await localVue.nextTick();
    expect(wrapper.vm.$data.showPercentages).toBe(true);
  });

  it("should recalculate values when changeDateRange is emitted", async () => {
    wrapper.vm.$root.$emit("changeDateRange", [1, 2]);
    await localVue.nextTick();
    [
      { name: "getConfirmed", value: 55 },
      { name: "getDeaths", value: 10 },
      { name: "getRecoveries", value: 30 },
      { name: "getActive", value: 15 },
      { name: "getInfectionRate", value: 0 },
      { name: "getFatalityRate", value: 18.18 },
      { name: "getRecoveryRate", value: 54.55 }
    ].forEach(({ name, value }) => expect(wrapper.vm[name]).toEqual(value));
  });
});

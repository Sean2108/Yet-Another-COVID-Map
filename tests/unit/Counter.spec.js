import { shallowMount, createLocalVue } from "@vue/test-utils";
import Counter from "../../src/components/Counter.vue";
import Vuetify from "vuetify";

describe("Counter.vue", () => {
  let localVue, wrapper;
  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuetify);
    wrapper = shallowMount(Counter, {
      localVue,
      propsData: {
        width: "20px",
        data: {
          confirmed: 20,
          deaths: 2,
          recovered: 4,
          active: 14
        }
      }
    });
  });

  it("should be hidden if data is null", () => {
    const nullDataWrapper = shallowMount(Counter, {
      localVue,
      propsData: {
        width: "20px",
        data: null
      }
    });
    expect(nullDataWrapper.contains(".title")).toBe(false);
    expect(nullDataWrapper.contains(".display-2")).toBe(false);
  });

  it("should have correct initial value", () => {
    expect(wrapper.find(".title").text()).toEqual("Total Confirmed");
    expect(wrapper.find(".display-2").text()).toEqual("20");
  });

  it("should have change header and text correctly", async () => {
    wrapper.vm.$root.$emit("changeType", "active");
    await localVue.nextTick();
    expect(wrapper.find(".title").text()).toEqual("Total Active");
    expect(wrapper.find(".display-2").text()).toEqual("14");
  });
});

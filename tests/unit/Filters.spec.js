import { mount, createLocalVue, createWrapper } from "@vue/test-utils";
import Filters from "../../src/components/Filters.vue";
import Vuetify from "vuetify";

describe("Filter.vue", () => {
  let localVue, wrapper;
  beforeEach(() => {
    localVue = createLocalVue();
    const vuetify = new Vuetify();
    localVue.use(vuetify);
    wrapper = mount(Filters, {
      localVue,
      vuetify,
      propsData: {
        worldData: [
          { date: "2/1/20", confirmed: 20, deaths: 5, recovered: 10 },
          { date: "2/2/20", confirmed: 50, deaths: 15, recovered: 25 },
          { date: "2/3/20", confirmed: 75, deaths: 15, recovered: 40 }
        ],
        width: "50px"
      }
    });
  });

  it("should have correct initial values", () => {
    expect(wrapper.vm.max).toEqual(2);
    expect(wrapper.vm.range).toEqual([0, 2]);
    expect(wrapper.vm.from).toEqual("2/1/20");
    expect(wrapper.vm.to).toEqual("2/3/20");
  });

  it("should emit changeType event when type is changed", async () => {
    const select = wrapper.find("#type-select");
    select.find("input").element.value = "deaths";
    await select.trigger("input");
    await wrapper.vm.$nextTick();
    const rootWrapper = createWrapper(wrapper.vm.$root);
    expect(rootWrapper.emitted().changeType).toHaveLength(1);
    expect(rootWrapper.emitted().changeType[0]).toEqual(["deaths"]);
  });

  it("should emit changeDateRange event when dates are changed", async () => {
    wrapper.vm.updateDates([1, 2]);
    await wrapper.vm.$nextTick();
    const rootWrapper = createWrapper(wrapper.vm.$root);
    expect(rootWrapper.emitted().changeDateRange).toHaveLength(1);
    expect(rootWrapper.emitted().changeDateRange[0]).toEqual([[1, 2]]);
  });
});

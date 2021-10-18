import { mount, createLocalVue } from "@vue/test-utils";
import StateInfo from "../../src/components/StateInfo.vue";
import Vuetify from "vuetify";

describe("StateInfo.vue", () => {
  let localVue, wrapper;
  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuetify);
    wrapper = mount(StateInfo, {
      localVue,
      propsData: {
        country: "United Kingdom",
        state: "London",
        iso: "GB",
        showPercentages: false,
      },
    });
  });

  it("should have correct initial state", () => {
    expect(wrapper.find(".hidden-md-and-down").exists()).toBe(false);
    expect(wrapper.vm.getHeader()).toEqual("London (United Kingdom)");
  });

  it("should have correct header when state is empty", () => {
    const statelessWrapper = mount(StateInfo, {
      localVue,
      propsData: {
        country: "United Kingdom",
        state: "",
        iso: "GB",
        showPercentages: false,
      },
    });
    expect(statelessWrapper.vm.getHeader()).toEqual("United Kingdom");
  });

  it("should have elements when data is retrieved", async () => {
    wrapper.vm.$data.stateData = [
      { active: 4, confirmed: 5, deaths: 0, recovered: 1 },
    ];
    wrapper.vm.$data.countryData = [
      { active: 40, confirmed: 50, deaths: 2, recovered: 8 },
    ];
    wrapper.vm.$data.news = [3];
    await localVue.nextTick();
    expect(wrapper.findAll(".hidden-md-and-down").length).toEqual(2);
  });

  it("should have have correct newest state and country data", async () => {
    wrapper.vm.$data.stateData = [1, 2, 3, 4, 5];
    wrapper.vm.$data.countryData = [6, 7, 8];
    await localVue.nextTick();
    expect(wrapper.vm.newestStateData).toEqual(5);
    expect(wrapper.vm.newestCountryData).toEqual(8);
  });

  const params = [
    {
      type: "active",
      expected: "Active cases: 1",
    },
    {
      type: "confirmed",
      expected: "Confirmed cases: 25 (Infection rate of 0.011%)",
    },
    {
      type: "deaths",
      expected: "Deaths: 9 (Fatality rate of 1.1%)",
    },
    {
      type: "recovered",
      expected: "Recoveries: 15 (Recovery rate of 6%)",
    },
  ];
  params.forEach(({ type, expected }) => {
    it("should return correct statistics description", () => {
      const input = {
        date: "2/1/20",
        confirmed: 25,
        deaths: 9,
        recovered: 15,
        confirmedRatio: 0.011111,
        deathsRatio: 1.10001,
        recoveredRatio: 5.9999,
      };
      expect(wrapper.vm.getStatisticsDescription(input, type)).toEqual(
        expected
      );
    });
  });
});

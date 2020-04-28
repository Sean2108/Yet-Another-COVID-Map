import { shallowMount, createLocalVue } from "@vue/test-utils";
import Table from "../../src/components/Table.vue";
import Vuetify from "vuetify";

describe("Table.vue", () => {
  let localVue, wrapper;

  const response = {
    AD: {
      country: "Andorra",
      lat: 42.5063,
      long: 1.5218,
      population: 5000,
      confirmed: 50, // 1
      deaths: 20, // 40
      recovered: 30 // 60
    },
    AE: {
      country: "United Arab Emirates",
      lat: 24,
      long: 54,
      population: 10000,
      confirmed: 6000, // 60
      deaths: 300, // 5
      recovered: 3000 // 50
    },
    AF: {
      country: "Afghanistan",
      lat: 33,
      long: 65,
      population: 40000,
      confirmed: 20000, // 50
      deaths: 4000, // 25
      recovered: 15000 // 75
    }
  };

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(Vuetify);
    wrapper = shallowMount(Table, {
      localVue,
      propsData: {
        width: "50px"
      }
    });
  });

  it("should not populate thresholds if fetch returns empty list", () => {
    wrapper.vm.handleResponse([]);
    expect(wrapper.vm.$data.thresholds).toEqual({
      confirmed: {
        firstThreshold: 0,
        secondThreshold: 0
      },
      deaths: {
        firstThreshold: 0,
        secondThreshold: 0
      },
      recovered: {
        firstThreshold: 0,
        secondThreshold: 0
      }
    });
  });

  it("should handle fetch response correctly", () => {
    wrapper.vm.handleResponse(response);
    expect(wrapper.vm.$data.thresholds).toEqual({
      confirmed: {
        firstThreshold: 50,
        secondThreshold: 60
      },
      deaths: {
        firstThreshold: 20,
        secondThreshold: 40
      },
      recovered: {
        firstThreshold: 60,
        secondThreshold: 75
      }
    });
  });

  const paramsColours = [
    { ratio: 50, type: "confirmed", expected: "orange darken-3" },
    { ratio: 49, type: "confirmed", expected: "green darken-3" },
    { ratio: 61, type: "confirmed", expected: "red darken-3" },
    { ratio: 40, type: "deaths", expected: "orange darken-3" },
    { ratio: 19, type: "deaths", expected: "green darken-3" },
    { ratio: 41, type: "deaths", expected: "red darken-3" },
    { ratio: 60, type: "recovered", expected: "orange darken-3" },
    { ratio: 76, type: "recovered", expected: "green darken-3" },
    { ratio: 59, type: "recovered", expected: "red darken-3" }
  ];

  paramsColours.forEach(({ ratio, type, expected }) => {
    it(`should return colour ${expected} for ${type} with ratio ${ratio}`, () => {
      wrapper.vm.handleResponse(response);
      expect(wrapper.vm.getColour(ratio, type)).toEqual(expected);
    });
  });

  const paramsTooltips = [
    {
      ratio: 60,
      type: "confirmed",
      expected:
        "Singapore has an infection rate of 60% which is average compared to other countries."
    },
    {
      ratio: 49,
      type: "confirmed",
      expected:
        "Singapore has an infection rate of 49% which is better than most other countries."
    },
    {
      ratio: 61,
      type: "confirmed",
      expected:
        "Singapore has an infection rate of 61% which is worse than most other countries."
    },
    {
      ratio: 20,
      type: "deaths",
      expected:
        "Singapore has a fatality rate of 20% which is average compared to other countries."
    },
    {
      ratio: 19,
      type: "deaths",
      expected:
        "Singapore has a fatality rate of 19% which is better than most other countries."
    },
    {
      ratio: 41,
      type: "deaths",
      expected:
        "Singapore has a fatality rate of 41% which is worse than most other countries."
    },
    {
      ratio: 75,
      type: "recovered",
      expected:
        "Singapore has a recovery rate of 75% which is average compared to other countries."
    },
    {
      ratio: 76,
      type: "recovered",
      expected:
        "Singapore has a recovery rate of 76% which is better than most other countries."
    },
    {
      ratio: 59,
      type: "recovered",
      expected:
        "Singapore has a recovery rate of 59% which is worse than most other countries."
    }
  ];

  paramsTooltips.forEach(({ ratio, type, expected }) => {
    it(`should return tooltip "${expected}" for ${type} with ratio ${ratio}`, () => {
      wrapper.vm.handleResponse(response);
      expect(wrapper.vm.getTooltip(ratio, "Singapore", type)).toEqual(expected);
    });
  });

  const paramsSort = [
    {
      type: "confirmed",
      isDesc: false,
      expected: ["Andorra", "United Arab Emirates", "Afghanistan"]
    },
    {
      type: "confirmed",
      isDesc: true,
      expected: ["Afghanistan", "United Arab Emirates", "Andorra"]
    },
    {
      type: "deaths",
      isDesc: false,
      expected: ["Andorra", "United Arab Emirates", "Afghanistan"]
    },
    {
      type: "deaths",
      isDesc: true,
      expected: ["Afghanistan", "United Arab Emirates", "Andorra"]
    },
    {
      type: "recovered",
      isDesc: false,
      expected: ["Andorra", "United Arab Emirates", "Afghanistan"]
    },
    {
      type: "recovered",
      isDesc: true,
      expected: ["Afghanistan", "United Arab Emirates", "Andorra"]
    }
  ];

  paramsSort.forEach(({ type, isDesc, expected }) => {
    it(`should sort correctly in ${
      isDesc ? "descending" : "ascending"
    } order for ${type}`, () => {
      wrapper.vm.handleResponse(response);
      const result = wrapper.vm.customSort(wrapper.vm.items, type, [isDesc]);
      expect(result.map(({ country }) => country)).toEqual(expected);
    });
  });

  const paramsSortRatios = [
    {
      type: "confirmed",
      isDesc: false,
      expected: ["Andorra", "Afghanistan", "United Arab Emirates"]
    },
    {
      type: "confirmed",
      isDesc: true,
      expected: ["United Arab Emirates", "Afghanistan", "Andorra"]
    },
    {
      type: "deaths",
      isDesc: false,
      expected: ["United Arab Emirates", "Afghanistan", "Andorra"]
    },
    {
      type: "deaths",
      isDesc: true,
      expected: ["Andorra", "Afghanistan", "United Arab Emirates"]
    },
    {
      type: "recovered",
      isDesc: false,
      expected: ["United Arab Emirates", "Andorra", "Afghanistan"]
    },
    {
      type: "recovered",
      isDesc: true,
      expected: ["Afghanistan", "Andorra", "United Arab Emirates"]
    }
  ];

  paramsSortRatios.forEach(({ type, isDesc, expected }) => {
    it(`should sort by ratios correctly in ${
      isDesc ? "descending" : "ascending"
    } order for ${type}`, () => {
      wrapper.vm.$data.showPercentages = true;
      wrapper.vm.handleResponse(response);
      const result = wrapper.vm.customSort(wrapper.vm.items, type, [isDesc]);
      expect(result.map(({ country }) => country)).toEqual(expected);
    });
  });
});

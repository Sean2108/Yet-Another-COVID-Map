import {
  convertDataToGeoJson,
  quickselect,
  getThreshold,
  getRatios
} from "../../src/utils";
import { DataTypes, CaseCountAggregatedWithRatios } from "@/types";

describe("convertDataToGeoJson function", () => {
  function getTestData() {
    return {
      AF: {
        country: "Afghanistan",
        states: {
          "": {
            lat: 33,
            long: 65,
            confirmed: 996,
            deaths: 33,
            recovered: 10,
            population: 5000
          }
        }
      },
      AL: {
        country: "Albania",
        states: {
          "": {
            lat: 41.1533,
            long: 20.1683,
            confirmed: 562,
            deaths: 26,
            recovered: 20,
            population: 6000
          }
        }
      },
      DZ: {
        country: "Algeria",
        states: {
          "": {
            lat: 28.0339,
            long: 1.6596,
            confirmed: 2629,
            deaths: 375,
            recovered: 30,
            population: 7000
          }
        }
      },
      AU: {
        country: "Australia",
        states: {
          "New South Wales": {
            lat: -33.8688,
            long: 151.2093,
            confirmed: 2926,
            deaths: 26,
            recovered: 40,
            population: 8000
          },
          "Northern Territory": {
            lat: -12.4634,
            long: 130.8456,
            confirmed: 28,
            deaths: 0,
            recovered: 5,
            population: 9000
          }
        }
      }
    };
  }

  it("should work correctly for confirmed cases", () => {
    const result = convertDataToGeoJson(getTestData(), DataTypes.CONFIRMED);
    const expectedFeatures = [
      {
        type: "Feature",
        properties: {
          iso: "AF",
          country: "Afghanistan",
          state: "",
          population: 5000,
          value: 996
        },
        geometry: { type: "Point", coordinates: [65, 33, 0.0] }
      },
      {
        type: "Feature",
        properties: {
          iso: "AL",
          country: "Albania",
          state: "",
          population: 6000,
          value: 562
        },
        geometry: { type: "Point", coordinates: [20.1683, 41.1533, 0.0] }
      },
      {
        type: "Feature",
        properties: {
          iso: "DZ",
          country: "Algeria",
          state: "",
          population: 7000,
          value: 2629
        },
        geometry: { type: "Point", coordinates: [1.6596, 28.0339, 0.0] }
      },
      {
        type: "Feature",
        properties: {
          iso: "AU",
          country: "Australia",
          state: "New South Wales",
          population: 8000,
          value: 2926
        },
        geometry: { type: "Point", coordinates: [151.2093, -33.8688, 0.0] }
      },
      {
        type: "Feature",
        properties: {
          iso: "AU",
          country: "Australia",
          state: "Northern Territory",
          population: 9000,
          value: 28
        },
        geometry: { type: "Point", coordinates: [130.8456, -12.4634, 0.0] }
      }
    ];
    expect(result.features).toEqual(expectedFeatures);
  });

  it("should work correctly for deaths", () => {
    const result = convertDataToGeoJson(getTestData(), DataTypes.DEATHS);
    const expectedFeatures = [
      {
        type: "Feature",
        properties: {
          iso: "AF",
          country: "Afghanistan",
          state: "",
          population: 5000,
          value: 33
        },
        geometry: { type: "Point", coordinates: [65, 33, 0.0] }
      },
      {
        type: "Feature",
        properties: {
          iso: "AL",
          country: "Albania",
          state: "",
          population: 6000,
          value: 26
        },
        geometry: { type: "Point", coordinates: [20.1683, 41.1533, 0.0] }
      },
      {
        type: "Feature",
        properties: {
          iso: "DZ",
          country: "Algeria",
          state: "",
          population: 7000,
          value: 375
        },
        geometry: { type: "Point", coordinates: [1.6596, 28.0339, 0.0] }
      },
      {
        type: "Feature",
        properties: {
          iso: "AU",
          country: "Australia",
          state: "New South Wales",
          population: 8000,
          value: 26
        },
        geometry: { type: "Point", coordinates: [151.2093, -33.8688, 0.0] }
      },
      {
        type: "Feature",
        properties: {
          iso: "AU",
          country: "Australia",
          state: "Northern Territory",
          population: 9000,
          value: 0
        },
        geometry: { type: "Point", coordinates: [130.8456, -12.4634, 0.0] }
      }
    ];
    expect(result.features).toEqual(expectedFeatures);
  });

  it("should work correctly for recoveries", () => {
    const result = convertDataToGeoJson(getTestData(), DataTypes.RECOVERIES);
    const expectedFeatures = [
      {
        type: "Feature",
        properties: {
          iso: "AF",
          country: "Afghanistan",
          state: "",
          population: 5000,
          value: 10
        },
        geometry: { type: "Point", coordinates: [65, 33, 0.0] }
      },
      {
        type: "Feature",
        properties: {
          iso: "AL",
          country: "Albania",
          state: "",
          population: 6000,
          value: 20
        },
        geometry: { type: "Point", coordinates: [20.1683, 41.1533, 0.0] }
      },
      {
        type: "Feature",
        properties: {
          iso: "DZ",
          country: "Algeria",
          state: "",
          population: 7000,
          value: 30
        },
        geometry: { type: "Point", coordinates: [1.6596, 28.0339, 0.0] }
      },
      {
        type: "Feature",
        properties: {
          iso: "AU",
          country: "Australia",
          state: "New South Wales",
          population: 8000,
          value: 40
        },
        geometry: { type: "Point", coordinates: [151.2093, -33.8688, 0.0] }
      },
      {
        type: "Feature",
        properties: {
          iso: "AU",
          country: "Australia",
          state: "Northern Territory",
          population: 9000,
          value: 5
        },
        geometry: { type: "Point", coordinates: [130.8456, -12.4634, 0.0] }
      }
    ];
    expect(result.features).toEqual(expectedFeatures);
  });

  it("should work correctly for active cases", () => {
    const result = convertDataToGeoJson(getTestData(), DataTypes.ACTIVE);
    const expectedFeatures = [
      {
        type: "Feature",
        properties: {
          iso: "AF",
          country: "Afghanistan",
          state: "",
          population: 5000,
          value: 953
        },
        geometry: { type: "Point", coordinates: [65, 33, 0.0] }
      },
      {
        type: "Feature",
        properties: {
          iso: "AL",
          country: "Albania",
          state: "",
          population: 6000,
          value: 516
        },
        geometry: { type: "Point", coordinates: [20.1683, 41.1533, 0.0] }
      },
      {
        type: "Feature",
        properties: {
          iso: "DZ",
          country: "Algeria",
          state: "",
          population: 7000,
          value: 2224
        },
        geometry: { type: "Point", coordinates: [1.6596, 28.0339, 0.0] }
      },
      {
        type: "Feature",
        properties: {
          iso: "AU",
          country: "Australia",
          state: "New South Wales",
          population: 8000,
          value: 2860
        },
        geometry: { type: "Point", coordinates: [151.2093, -33.8688, 0.0] }
      },
      {
        type: "Feature",
        properties: {
          iso: "AU",
          country: "Australia",
          state: "Northern Territory",
          population: 9000,
          value: 23
        },
        geometry: { type: "Point", coordinates: [130.8456, -12.4634, 0.0] }
      }
    ];
    expect(result.features).toEqual(expectedFeatures);
  });
});

describe("quickSelect function", () => {
  const parameters = [
    {
      description: "should behave correctly when list has >k elements",
      input: [2, 6, 8, 4, 4, 1, -1],
      k: 4,
      expected: 4
    },
    {
      description: "should behave correctly when list has =k elements",
      input: [2, 6, 8, 4, 4, 1, 0, -1],
      k: 7,
      expected: 8
    },
    {
      description: "should return largest value when list has <k elements",
      input: [8, 4, 1],
      k: 4,
      expected: 8
    },
    {
      description: "should return smallest value when k is negative",
      input: [8, 4, 1],
      k: -1,
      expected: 1
    }
  ];
  parameters.forEach(({ description, input, k, expected }) => {
    it(description, () => {
      expect(quickselect(input, k)).toEqual(expected);
    });
  });
});

describe("getThreshold function", () => {
  const input = [
    {
      country: "a",
      confirmed: 3,
      deaths: 1,
      recovered: 2,
      population: 6,
      lat: 0,
      long: 0
    }, // 50, 33.3, 66.7
    {
      country: "b",
      confirmed: 5,
      deaths: 2,
      recovered: 2,
      population: 25,
      lat: 0,
      long: 0
    }, // 20, 40, 40
    {
      country: "c",
      confirmed: 10,
      deaths: 3,
      recovered: 5,
      population: 1000,
      lat: 0,
      long: 0
    }, // 1, 30, 50
    {
      country: "d",
      confirmed: 20,
      deaths: 4,
      recovered: 15,
      population: 3000,
      lat: 0,
      long: 0
    }, // 1.5, 20, 75
    {
      country: "e",
      confirmed: 8,
      deaths: 3,
      recovered: 5,
      population: 160,
      lat: 0,
      long: 0
    }, // 5, 37.5, 62.5
    {
      country: "f",
      confirmed: 9,
      deaths: 2,
      recovered: 7,
      population: 36,
      lat: 0,
      long: 0
    } // 25, 22.2, 77.8
  ];
  // after sorting confirmed ratios: [1, 1.5, 5, 20, 25, 50]
  // after sorting death ratios: [20, 22.2, 30, 33.3, 37.5, 40]
  // after sorting recovered ratios: [40, 50, 62.5, 66.7, 75, 77.8]

  it("should return the correct result for confirmed", () => {
    const items: Array<CaseCountAggregatedWithRatios> = input.map(getRatios);
    const result = getThreshold(items, DataTypes.CONFIRMED);
    expect(result).toEqual({
      firstThreshold: 5,
      secondThreshold: 25
    });
  });

  it("should return the correct result for deaths", () => {
    const items: Array<CaseCountAggregatedWithRatios> = input.map(getRatios);
    const result = getThreshold(items, DataTypes.DEATHS);
    expect(result).toEqual({
      firstThreshold: 30,
      secondThreshold: 37.5
    });
  });

  it("should return the correct result for recoveries", () => {
    const items: Array<CaseCountAggregatedWithRatios> = input.map(getRatios);
    const result = getThreshold(items, DataTypes.RECOVERIES);
    expect(result).toEqual({
      firstThreshold: 62.5,
      secondThreshold: 75
    });
  });
});

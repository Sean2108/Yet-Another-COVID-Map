import { convertDataToGeoJson, getTopKSorted } from "../../src/utils";

describe("convertDataToGeoJson function", () => {
  it("should work correctly for confirmed cases", () => {
    const data = {
      Afghanistan: {
        "": {
          lat: 33,
          long: 65,
          confirmed: 996,
          deaths: 33,
        },
      },
      Albania: {
        "": {
          lat: 41.1533,
          long: 20.1683,
          confirmed: 562,
          deaths: 26,
        },
      },
      Algeria: {
        "": {
          lat: 28.0339,
          long: 1.6596,
          confirmed: 2629,
          deaths: 375,
        },
      },
      Australia: {
        "New South Wales": {
          lat: -33.8688,
          long: 151.2093,
          confirmed: 2926,
          deaths: 26,
        },
        "Northern Territory": {
          lat: -12.4634,
          long: 130.8456,
          confirmed: 28,
          deaths: 0,
        },
      },
    };
    const result = convertDataToGeoJson(data, true);
    const expectedFeatures = [
      {
        type: "Feature",
        properties: {
          country: "Afghanistan",
          state: "",
          value: 996,
        },
        geometry: { type: "Point", coordinates: [65, 33, 0.0] },
      },
      {
        type: "Feature",
        properties: {
          country: "Albania",
          state: "",
          value: 562,
        },
        geometry: { type: "Point", coordinates: [20.1683, 41.1533, 0.0] },
      },
      {
        type: "Feature",
        properties: {
          country: "Algeria",
          state: "",
          value: 2629,
        },
        geometry: { type: "Point", coordinates: [1.6596, 28.0339, 0.0] },
      },
      {
        type: "Feature",
        properties: {
          country: "Australia",
          state: "New South Wales",
          value: 2926,
        },
        geometry: { type: "Point", coordinates: [151.2093, -33.8688, 0.0] },
      },
      {
        type: "Feature",
        properties: {
          country: "Australia",
          state: "Northern Territory",
          value: 28,
        },
        geometry: { type: "Point", coordinates: [130.8456, -12.4634, 0.0] },
      },
    ];
    expect(result.features).toEqual(expectedFeatures);
  });

  it("should work correctly for deaths", () => {
    const data = {
      Afghanistan: {
        "": {
          lat: 33,
          long: 65,
          confirmed: 996,
          deaths: 33,
        },
      },
      Albania: {
        "": {
          lat: 41.1533,
          long: 20.1683,
          confirmed: 562,
          deaths: 26,
        },
      },
      Algeria: {
        "": {
          lat: 28.0339,
          long: 1.6596,
          confirmed: 2629,
          deaths: 375,
        },
      },
      Australia: {
        "New South Wales": {
          lat: -33.8688,
          long: 151.2093,
          confirmed: 2926,
          deaths: 26,
        },
        "Northern Territory": {
          lat: -12.4634,
          long: 130.8456,
          confirmed: 28,
          deaths: 0,
        },
      },
    };
    const result = convertDataToGeoJson(data, false);
    const expectedFeatures = [
      {
        type: "Feature",
        properties: {
          country: "Afghanistan",
          state: "",
          value: 33,
        },
        geometry: { type: "Point", coordinates: [65, 33, 0.0] },
      },
      {
        type: "Feature",
        properties: {
          country: "Albania",
          state: "",
          value: 26,
        },
        geometry: { type: "Point", coordinates: [20.1683, 41.1533, 0.0] },
      },
      {
        type: "Feature",
        properties: {
          country: "Algeria",
          state: "",
          value: 375,
        },
        geometry: { type: "Point", coordinates: [1.6596, 28.0339, 0.0] },
      },
      {
        type: "Feature",
        properties: {
          country: "Australia",
          state: "New South Wales",
          value: 26,
        },
        geometry: { type: "Point", coordinates: [151.2093, -33.8688, 0.0] },
      },
      {
        type: "Feature",
        properties: {
          country: "Australia",
          state: "Northern Territory",
          value: 0,
        },
        geometry: { type: "Point", coordinates: [130.8456, -12.4634, 0.0] },
      },
    ];
    expect(result.features).toEqual(expectedFeatures);
  });
});

describe("getTopKSorted function", () => {
  const parameters = [
    {
      description: "should behave correctly when list has >k elements",
      input: [2, 6, 8, 4, 4, 1, -1],
      k: 4,
      expected: [4, 4, 6, 8],
    },
    {
      description: "should behave correctly when list has =k elements",
      input: [2, 6, 8, 4, 4, 1, 0, -1],
      k: 1,
      expected: [8],
    },
    {
      description: "should return empty list when list has <k elements",
      input: [8, 4, 1],
      k: 4,
      expected: [],
    },
    {
      description: "should return empty list when k is negative",
      input: [8, 4, 1],
      k: -1,
      expected: [],
    },
    {
      description: "should return empty list for empty list",
      input: [],
      k: 4,
      expected: [],
    },
  ];
  parameters.forEach(({ description, input, k, expected }) => {
    it(description, () => {
      expect(
        getTopKSorted(input, k, (a, b) => (a < b ? -1 : a > b ? 1 : 0))
      ).toEqual(expected);
    });
  });
});

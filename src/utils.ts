import {
  CaseCounts,
  GeoJson,
  GeoJsonFeature,
  CaseCountAggregated,
  DataTypes,
} from "@/types";
import _ from "lodash";

export async function fetchData(
  endpoint: "cases" | "news",
  from: string,
  to: string,
  country: string,
  aggregateCountries: boolean,
  perDay: boolean,
  worldTotal: boolean
) {
  const response = await fetch(
    `https://yet-another-covid-api.herokuapp.com/${endpoint}?from=${from}&to=${to}&country=${country}&aggregatecountries=${aggregateCountries}&perday=${perDay}&worldtotal=${worldTotal}`
  );
  if (response.status !== 200) {
    return worldTotal ? [] : {};
  }
  return await response.json();
}

export function convertDataToGeoJson(
  data: CaseCounts,
  type: DataTypes
): GeoJson {
  const features: Array<GeoJsonFeature> = Object.entries(data).flatMap(
    ([country, stateInfo]) =>
      Object.entries(stateInfo).map(
        ([
          state,
          { lat, long, confirmed, deaths, recovered },
        ]): GeoJsonFeature => ({
          type: "Feature",
          properties: {
            country,
            state,
            value:
              type === DataTypes.CONFIRMED
                ? confirmed
                : type === DataTypes.DEATHS
                ? deaths
                : recovered,
          },
          geometry: { type: "Point", coordinates: [long, lat, 0.0] },
        })
      )
  );
  return {
    type: "FeatureCollection",
    features,
  };
}

function swap<T>(arr: Array<T>, i: number, j: number) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

function quickselectStep<T>(
  arr: Array<T>,
  k: number,
  left: number,
  right: number,
  compare: (a: T, b: T) => number
) {
  while (right > left) {
    const t = arr[k];
    let i = left;
    let j = right;

    swap(arr, left, k);
    if (compare(arr[right], t) > 0) {
      swap(arr, left, right);
    }

    while (i < j) {
      swap(arr, i, j);
      i++;
      j--;
      while (compare(arr[i], t) < 0) {
        i++;
      }
      while (compare(arr[j], t) > 0) {
        j--;
      }
    }

    if (compare(arr[left], t) === 0) {
      swap(arr, left, j);
    } else {
      j++;
      swap(arr, j, right);
    }

    if (j <= k) {
      left = j + 1;
    }
    if (k <= j) {
      right = j - 1;
    }
  }
}

function quickselect<T>(
  arr: Array<T>,
  k: number,
  compare: (a: T, b: T) => number
) {
  const copy = _.cloneDeep(arr);
  quickselectStep(copy, k, 0, arr.length - 1, compare);
  return copy;
}

export function getTopKSorted<T>(
  arr: Array<T>,
  k: number,
  compare: (a: T, b: T) => number
): Array<T> {
  if (k < 0 || k >= arr.length) {
    return [];
  }
  return quickselect(arr, k, compare)
    .slice(arr.length - k, arr.length)
    .sort(compare);
}

export function compareByCases(
  a: CaseCountAggregated,
  b: CaseCountAggregated
): number {
  return a.confirmed < b.confirmed ? -1 : a.confirmed > b.confirmed ? 1 : 0;
}

export function compareByDeaths(
  a: CaseCountAggregated,
  b: CaseCountAggregated
): number {
  return a.deaths < b.deaths ? -1 : a.deaths > b.deaths ? 1 : 0;
}

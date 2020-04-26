import {
  CaseCounts,
  GeoJson,
  GeoJsonFeature,
  CaseCountAggregated,
  DataTypes,
  Endpoints,
  CaseCountAggregatedWithRatios
} from "@/types";
import _ from "lodash";

export async function fetchData(
  endpoint: Endpoints,
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
    return null;
  }
  return await response.json();
}

export function getValue(
  confirmed: number,
  deaths: number,
  recovered: number,
  type: DataTypes
): number {
  switch (type) {
    case DataTypes.DEATHS:
      return deaths;
    case DataTypes.RECOVERIES:
      return recovered;
    case DataTypes.ACTIVE:
      return Math.max(confirmed - deaths - recovered, 0);
    case DataTypes.CONFIRMED:
    default:
      return confirmed;
  }
}

export function convertDataToGeoJson(
  data: CaseCounts,
  type: DataTypes
): GeoJson {
  const features: Array<GeoJsonFeature> = Object.entries(data)
    .map(([iso, countryInfo]) => ({ iso, ...countryInfo }))
    .flatMap(({ iso, country, states }) =>
      Object.entries(states).map(
        ([
          state,
          { lat, long, confirmed, deaths, recovered, population }
        ]): GeoJsonFeature => ({
          type: "Feature",
          properties: {
            iso,
            country,
            state,
            population,
            value: getValue(confirmed, deaths, recovered, type)
          },
          geometry: { type: "Point", coordinates: [long, lat, 0.0] }
        })
      )
    );
  return {
    type: "FeatureCollection",
    features
  };
}
function swap(arr: Array<number>, i: number, j: number) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

function quickselectStep(
  arr: Array<number>,
  k: number,
  left: number,
  right: number
) {
  while (right > left) {
    const t = arr[k];
    let i = left;
    let j = right;

    swap(arr, left, k);
    if (arr[right] > t) {
      swap(arr, left, right);
    }

    while (i < j) {
      swap(arr, i, j);
      i++;
      j--;
      while (arr[i] < t) {
        i++;
      }
      while (arr[j] > t) {
        j--;
      }
    }

    if (arr[left] === t) {
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

export function quickselect(arr: Array<number>, k: number): number {
  if (!arr || !arr.length) {
    throw "quickselect function: list cannot be empty.";
  }
  k = Math.max(0, k);
  k = Math.min(arr.length - 1, k);
  const copy = _.cloneDeep(arr);
  quickselectStep(copy, k, 0, arr.length - 1);
  return copy[k];
}

export function getRatios(
  item: CaseCountAggregated
): CaseCountAggregatedWithRatios {
  const { confirmed, deaths, recovered, population } = item;
  return {
    ...item,
    confirmedRatio: population ? (confirmed / population) * 100 : 0,
    deathsRatio: confirmed ? (deaths / confirmed) * 100 : 0,
    recoveredRatio: confirmed ? (recovered / confirmed) * 100 : 0
  };
}

export function getThreshold(
  ratios: Array<CaseCountAggregatedWithRatios>,
  type: DataTypes
) {
  const ratioArr = ratios.map(
    ({ confirmedRatio, deathsRatio, recoveredRatio }) => {
      switch (type) {
        case DataTypes.CONFIRMED:
          return confirmedRatio;
        case DataTypes.DEATHS:
          return deathsRatio;
        case DataTypes.RECOVERIES:
        default:
          return recoveredRatio;
      }
    }
  );
  const firstThresholdIndex = Math.floor(ratios.length / 3);
  return {
    firstThreshold: quickselect(ratioArr, firstThresholdIndex),
    secondThreshold: quickselect(ratioArr, firstThresholdIndex * 2)
  };
}

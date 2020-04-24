import {
  CaseCounts,
  GeoJson,
  GeoJsonFeature,
  CaseCountAggregated,
  DataTypes,
  Endpoints,
  TableRow,
  CountryRatios,
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

export function getRatios(
  confirmed: number,
  deaths: number,
  recovered: number
) {
  return {
    deathsRatio: confirmed ? (deaths / confirmed) * 100 : 0,
    recoveredRatio: confirmed ? (recovered / confirmed) * 100 : 0,
  };
}

export function getRatiosArray(
  items: Array<TableRow>
): Array<Array<string | CountryRatios>> {
  return items.map(({ country, confirmed, deaths, recovered }) => [
    country,
    getRatios(confirmed, deaths, recovered),
  ]);
}

export function getThreshold(
  ratios: Array<Array<string | CountryRatios>>,
  type: DataTypes
) {
  const ratioArr = ratios.map(([, ratio]) =>
    type === DataTypes.DEATHS
      ? (ratio as CountryRatios).deathsRatio
      : (ratio as CountryRatios).recoveredRatio
  );
  const firstThresholdIndex = Math.floor(ratios.length / 3);
  return {
    firstThreshold: quickselect(ratioArr, firstThresholdIndex),
    secondThreshold: quickselect(ratioArr, firstThresholdIndex * 2),
  };
}

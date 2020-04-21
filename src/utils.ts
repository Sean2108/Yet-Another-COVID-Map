import { CaseCounts, GeoJson, GeoJsonFeature } from "@/types";

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
  return await response.json();
}

export function convertDataToGeoJson(
  data: CaseCounts,
  getConfirmed: boolean
): GeoJson {
  const features: Array<GeoJsonFeature> = Object.entries(data).flatMap(
    ([country, stateInfo]) =>
      Object.entries(stateInfo).map(
        ([
          state,
          { Lat: lat, Long: long, Confirmed: confirmed, Deaths: deaths },
        ]): GeoJsonFeature => ({
          type: "Feature",
          properties: {
            country,
            state,
            value: getConfirmed ? confirmed : deaths,
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

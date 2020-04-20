interface CaseCounts {
  [country: string]: {
    [state: string]: {
      Lat: number;
      Long: number;
      Confirmed: number;
      Deaths: number;
    };
  };
}

interface GeoJson {
  type: string;
  features: Array<GeoJsonFeature>;
}

interface GeoJsonFeature {
  type: string;
  properties: {
    country: string;
    state: string;
    value: number;
  };
  geometry: {
    type: string;
    coordinates: Array<number>;
  };
}

export async function fetchData(
  endpoint: "cases" | "news",
  from: string,
  to: string,
  aggregateCountries: boolean,
  worldTotal: boolean
) {
  const response = await fetch(
    `https://yet-another-covid-api.herokuapp.com/${endpoint}?from=${from}&to=${to}&aggregateCountries=${aggregateCountries}&worldTotal=${worldTotal}`
  );
  return await response.json();
}

export function convertDataToGeoJson(data: CaseCounts, getConfirmed: boolean): GeoJson {
  const features: Array<GeoJsonFeature> = Object.entries(data).flatMap(
    ([country, stateInfo]) =>
      Object.entries(stateInfo).map(
        ([
          state,
          { Lat: lat, Long: long, Confirmed: confirmed, Deaths: deaths },
        ]): GeoJsonFeature => ({
          type: "Feature",
          properties: { country, state, value: (getConfirmed ? confirmed : deaths) },
          geometry: { type: "Point", coordinates: [long, lat, 0.0] },
        })
      )
  );
  return {
    type: "FeatureCollection",
    features,
  };
}

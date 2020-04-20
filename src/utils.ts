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

export function getMapPaintObj(isCluster: boolean, firstThreshold: number, secondThreshold: number): mapboxgl.CirclePaint {
  const prop = isCluster ? "sum" : "value";
  return {
    "circle-color": [
      "step",
      ["get", prop],
      "#51bbd6",
      firstThreshold,
      "#f1f075",
      secondThreshold,
      "#f28cb1",
    ],
    "circle-radius": [
      "step",
      ["get", prop],
      20,
      firstThreshold,
      30,
      secondThreshold,
      40,
    ],
  };
}

export const drawLayer = (
  map: mapboxgl.Map,
  isCluster: boolean,
  firstThreshold: number,
  secondThreshold: number
): void => {
  const id = isCluster ? "clusters" : "non-clusters";
  const filter = isCluster ? ["has", "sum"] : ["!", ["has", "sum"]];
  map.addLayer({
    id,
    type: "circle",
    source: "cases",
    filter,
    paint: getMapPaintObj(isCluster, firstThreshold, secondThreshold),
  });

  map.addLayer({
    id: `${id}-count`,
    type: "symbol",
    source: "cases",
    filter,
    layout: {
      "text-field": isCluster ? "{sum}" : ["get", "value"],
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  });
};

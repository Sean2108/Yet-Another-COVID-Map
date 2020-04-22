export interface CaseCounts {
  [country: string]: {
    [state: string]: CaseCountAggregated;
  };
}

export interface GeoJson {
  type: string;
  features: Array<GeoJsonFeature>;
}

export interface GeoJsonFeature {
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

interface Statistics {
  confirmed: number;
  deaths: number;
  recovered: number;
}

export interface CaseCountRaw extends Statistics {
  date: string;
}

export interface CaseCount extends Statistics {
  date: Date | null;
}

export interface NewsItem {
    source: string;
    title: string;
    description: string;
    url: string;
    thumbnailUrl: string;
    publishedAt: string;
}

export interface CaseCountAggregated extends Statistics {
  lat: number;
  long: number;
}

export enum DataTypes {
  CONFIRMED = "confirmed",
  DEATHS = "deaths",
  RECOVERIES = "recovered"
}

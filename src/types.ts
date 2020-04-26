export interface CaseCounts {
  [country: string]: {
    country: string;
    states: {
      [state: string]: CaseCountAggregated;
    };
  };
}

export interface AggCountryCaseCounts {
  [country: string]: NamedCaseCountAggregated;
}

export interface GeoJson {
  type: string;
  features: Array<GeoJsonFeature>;
}

export interface GeoJsonFeature {
  type: string;
  properties: {
    iso: string;
    country: string;
    state: string;
    population: number;
    value: number;
  };
  geometry: {
    type: string;
    coordinates: Array<number>;
  };
}

export interface Statistics {
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
  population: number;
}

export interface NamedCaseCountAggregated extends CaseCountAggregated {
  country: string;
}

export enum DataTypes {
  CONFIRMED = "confirmed",
  DEATHS = "deaths",
  RECOVERIES = "recovered",
}

export enum Endpoints {
  CASES = "cases",
  NEWS = "news",
}

export interface CaseCountAggregatedWithRatios extends CaseCountAggregated {
  confirmedRatio: number;
  deathsRatio: number;
  recoveredRatio: number;
}

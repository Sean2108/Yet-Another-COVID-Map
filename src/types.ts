export interface CaseCounts {
  [country: string]: {
    country: string;
    states: {
      [state: string]: CaseCountAggregatedWithLocation;
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
  active: number;
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
  population: number;
}

export interface CaseCountAggregatedWithLocation extends CaseCountAggregated {
  lat: number;
  long: number;
}

export interface NamedCaseCountAggregated extends CaseCountAggregated {
  country: string;
}

export enum DataTypes {
  CONFIRMED = "confirmed",
  DEATHS = "deaths",
  RECOVERIES = "recovered",
  ACTIVE = "active"
}

export enum Endpoints {
  CASES = "cases",
  NEWS = "news"
}

export interface CaseCountAggregatedWithRatios extends CaseCountAggregated {
  confirmedRatio: number;
  deathsRatio: number;
  recoveredRatio: number;
}

interface ChartInput extends Statistics {
  active: number;
  deathsRatio: number;
  recoveredRatio: number;
}

export interface ChartInputWithRawDate extends ChartInput {
  date: string;
}

export interface ChartInputWithDate extends ChartInput {
  date: Date | null;
}

export interface CaseCounts {
  [country: string]: {
    [state: string]: {
      Lat: number;
      Long: number;
      Confirmed: number;
      Deaths: number;
    };
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

export interface CaseCountCapitalised {
  Date: string;
  Confirmed: number;
  Deaths: number;
}

export interface CaseCount {
  date: Date | null;
  confirmed: number;
  deaths: number;
}

export interface NewsItem {
    Source: string;
    Title: string;
    Description: string;
    URL: string;
    ThumbnailURL: string;
    PublishedAt: string;
}

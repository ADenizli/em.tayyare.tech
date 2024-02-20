import IPosition from '@modules/common/interfaces/Position';

export default interface IAirport {
  icao: string;
  iata: string;
  name: string;
  position: IPosition;
  iso_country: ICountry;
  iso_region: IRegion;
  gates: IGate[];
  runways: IRunway[];
}

export interface IGate {
  ident: string;
  position: IPosition;
}

export interface IRunway {
  ident: string;
  position: IPosition;
  instrument_frequency?: number;
  course: number;
  is_closed: boolean;
}

export interface ICountry {
  iso: string;
  name: string;
  continent: string;
}

export interface IRegion {
  iso: string;
  city: string;
}

export default interface IAirport {
  id: number;
  name: string;
  icao: string;
  latitude: number;
  longitude: number;
  elevation: number;
  transitionAltitude: number;
  transitionLevel: number;
  runways: IRunway[];
}

export interface IRunway {
  id: number;
  airportID: number;
  ident: string;
  trueHeading: number;
  length: number;
  width: number;
  surface?: string;
  latitude: number;
  longitude: number;
  elevation: number;
}

export interface IILS {}

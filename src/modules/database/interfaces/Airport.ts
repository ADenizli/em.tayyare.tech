export default interface Airport {
  id: number;
  name: string;
  icao: string;
  latitude: number;
  longitude: number;
  elevation: number;
  transitionAltitude: number;
  transitionLevel: number;
  runways: Runway[];
}

export interface Runway {
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

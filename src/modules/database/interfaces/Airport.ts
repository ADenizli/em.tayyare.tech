import IPosition from '@modules/common/interfaces/Position';

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
  ils?: IILS;
}

export interface IILS {
  id: number;
  ident?: string;
  frequency: number;
  gsAngle: number;
  category: number;
  locCourse: number;
  crossingHeight: number;
  hasDme: boolean;
  position: IPosition;
}

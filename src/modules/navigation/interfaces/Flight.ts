import IPosition from '@modules/common/interfaces/Position';
import EDepartureTypes from '../enum/DepartureTypes';
import ELegTypes from '../enum/LegTypes';
import ERouteItemTypes from '../enum/RouteItemTypes';

export default interface IFlight {
  callsign: string;
  origin: string;
  destination: string;
  route?: IRouteItem[];
  departureConfigration: {
    runway: string;
    activeLandingRunway: string;
    departureType: EDepartureTypes;
    ident?: number;
  };
  legs: ILeg[];
}

export interface IRouteItem {
  type: ERouteItemTypes;
  ident: string;
}

export interface ILeg {
  type: ELegTypes;
  ident: string;
  position: IPosition;
  restrictions?: {
    maxAlt?: number;
    minAlt?: number;
    maxSpd?: number;
    minSpd?: number;
  };
}

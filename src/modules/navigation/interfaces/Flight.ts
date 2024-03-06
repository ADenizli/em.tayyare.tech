import IPosition from '@modules/common/interfaces/Position';
import EDepartureTypes from '../enum/DepartureTypes';
import ELegTypes from '../enum/LegTypes';
import ERouteItemTypes from '../enum/RouteItemTypes';
import ITerminalProcedure, {
  ITerminalLeg,
} from '@modules/database/interfaces/TerminalProcedure';
import EFlightPhases from '../enum/FlightPhases';
import EApproachTypes from '../enum/ApproachTypes';

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
    sidLegs: ITerminalLeg[];
    sidInfo: ITerminalProcedure;
  };
  approachConfigration: {
    runway: string;
    approachID: number;
    approachType: EApproachTypes;
    ident?: string;
    starLegs: ITerminalLeg[];
    starInfo: ITerminalProcedure;
    transition?: string;
    landingProcedure: number;
  };
  legs: ILeg[];
}

export interface IRouteItem {
  type: ERouteItemTypes;
  ident: string;
}

export interface ILeg {
  phase: EFlightPhases;
  type: ELegTypes;
  ident: string;
  trueHeading?: number;
  followHeading?: number;
  position?: IPosition;
  procedure?: IProcedure;
  togo?: number;
  restrictions?: {
    maxAlt?: number;
    atAlt?: number;
    minAlt?: number;
    maxSpd?: number;
    atSpd?: number;
    minSpd?: number;
  };
}

export interface IProcedure {
  clbAlt?: number;
  desAlt?: number;
  course: number;
}

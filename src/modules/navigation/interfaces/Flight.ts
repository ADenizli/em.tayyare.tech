import IPosition from '@modules/common/interfaces/Position';
import EDepartureTypes from '../enum/DepartureTypes';
import ELegTypes from '../enum/LegTypes';
import ERouteItemTypes from '../enum/RouteItemTypes';
import ITerminalProcedure, {
  ITerminalLeg,
} from '@modules/database/interfaces/TerminalProcedure';
import EFlightPhases from '../enum/FlightPhases';
import EApproachTypes from '../enum/ApproachTypes';
import ENavaidTypes from '../enum/NavaidTypes';

export default interface IFlight {
  callsign: string;
  origin: string;
  destination: string;
  route?: IRouteItem[];
  departureProcedure?: {
    sidLegs?: ITerminalLeg[];
    sidInfo?: ITerminalProcedure;
  };
  departureConfigration: {
    ident?: number;
    runway: string;
    activeLandingRunway: string;
    departureType: EDepartureTypes;
  };
  approachConfigration: {
    runway: string;
    approachID: number;
    approachType: EApproachTypes;
    ident?: string;
    transition?: string;
    landingProcedure: number;
  };
  approachProcedure?: {
    starInfo?: ITerminalProcedure;
    starLegs?: ITerminalLeg[];
    transition?: string;
  };
  legs: ILeg[];
}

export interface IRouteItem {
  type: ERouteItemTypes;
  id: number;
}

export interface ILeg {
  phase: EFlightPhases; // REQ FOR: ALL
  type: ELegTypes; // REQ FOR: ALL
  ident: string; // REQ FOR: ALL
  compassDirections?: ICompassDirections; // REQ FOR: ALL
  position?: IPosition; // REQ FOR: RWY, FIX
  procedure?: IProcedure; // REQ FOR: CLBTO, DESTO
  togo?: number; // REQ FOR: ALL
  course?: number;
  restrictions?: {
    altitude?: ILegAltitudeRestrictions;
    speed?: ILegSpeedRestrictions;
  };
  transition?: boolean; // REQ FOR: APP, LND
  dme?: {
    ident: string;
    type: ENavaidTypes;
    frequency: string;
    distance: number;
    course: number;
  };
}

export interface ILegAltitudeRestrictions {
  maxAlt?: number;
  atAlt?: number;
  minAlt?: number;
}

export interface ILegSpeedRestrictions {
  maxSpd?: number;
  atSpd?: number;
  minSpd?: number;
}
export interface IProcedure {
  clbAlt?: number;
  desAlt?: number;
  course: number;
}

export interface ICompassDirections {
  trueHeading: number;
  magneticHeading: number;
}

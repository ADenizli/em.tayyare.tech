import { AirportEntity } from '../entities/airport.entity';
import { ILSEntity } from '../entities/ils.entity';
import { RunwayEntity } from '../entities/runway.entity';
import ESpeedLimitDesc from '../enums/SpeedLimitDesc';
import IWaypoint, { INavaid } from './Point';

export default interface ITerminalProcedure {
  id: number;
  airportID: AirportEntity;
  proc: string;
  icao: string;
  fullName: string;
  name: string;
  rwy: string;
  rwyID: RunwayEntity;
  ilsID: ILSEntity;
}

export interface ITerminalLeg {
  id: number;
  terminalID: number;
  type: string;
  transition: string;
  trackCode: string;
  wptID: IWaypoint;
  wptLat: number;
  wptLon: number;
  turnDir: number;
  navID?: INavaid;
  navLat: number;
  navLon: number;
  navBear: number;
  navDist: number;
  course: number;
  distance: number;
  alt: string;
  vnav: number;
  centerID?: IWaypoint;
  centerLat: number;
  centerLon: number;
  wptDescCode: string;
  speedLimit?: ITerminalLegSpdLimit;
}

export interface ITerminalLegSpdLimit {
  id: number;
  isFlyOver: boolean;
  speedLimit: number | null;
  speedLimitDescription: ESpeedLimitDesc | null;
}

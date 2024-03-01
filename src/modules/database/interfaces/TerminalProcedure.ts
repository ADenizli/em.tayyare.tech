import { AirportEntity } from '../entities/airport.entity';
import { ILSEntity } from '../entities/ils.entity';
import { RunwayEntity } from '../entities/runway.entity';
import { TerminalProceduresEntity } from '../entities/terminalProcedures.entity';
import { TerminalLegSpdLimitEntity } from '../entities/terminalProceduresFixesSpdLimits.entity';
import { WaypointEntity } from '../entities/waypoint.entity';
import ESpeedLimitDesc from '../enums/SpeedLimitDesc';
import { INavaid } from './Point';

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
  terminalID: TerminalProceduresEntity;
  type: string;
  transition: string;
  trackCode: string;
  wptID: WaypointEntity;
  wptLat: number;
  wptLon: number;
  turnDir: number;
  navID: INavaid;
  navLat: number;
  navLon: number;
  navBear: number;
  navDist: number;
  course: number;
  distance: number;
  alt: number;
  vnav: number;
  centerID: WaypointEntity;
  centerLat: number;
  centerLon: number;
  wptDescCode: string;
  speedLimit: TerminalLegSpdLimitEntity;
}

export interface ITerminalLegSpdLimit {
  id: number;
  isFlyOver: boolean;
  speedLimit: number;
  speedLimitDescription: ESpeedLimitDesc;
}

import { AirportEntity } from './airport.entity';
import { ILSEntity } from './ils.entity';
import { NavaidEntity } from './navaid.entity';
import { RunwayEntity } from './runway.entity';
import { SurfaceTypeEntity } from './surfaceType.entity';
import { TerminalLegEntity } from './terminalLeg.entity';
import { TerminalProcedureEntity } from './terminalProcedure.entity';
import { WaypointEntity } from './waypoint.entity';

const DatabaseModuleEntities = [
  AirportEntity,
  RunwayEntity,
  SurfaceTypeEntity,
  ILSEntity,
  TerminalProcedureEntity,
  TerminalLegEntity,
  NavaidEntity,
  WaypointEntity,
];

export default DatabaseModuleEntities;

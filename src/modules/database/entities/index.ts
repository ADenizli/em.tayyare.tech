import { AirportEntity } from './airport.entity';
import { ILSEntity } from './ils.entity';
import { NavaidEntity } from './navaid.entity';
import { RunwayEntity } from './runway.entity';
import { SurfaceTypeEntity } from './surfaceType.entity';
import { TerminalLegEntity } from './terminalProcedureLegs.entity';
import { TerminalProceduresEntity } from './terminalProcedures.entity';
import { WaypointEntity } from './waypoint.entity';

const DatabaseModuleEntities = [
  AirportEntity,
  RunwayEntity,
  SurfaceTypeEntity,
  ILSEntity,
  TerminalProceduresEntity,
  TerminalLegEntity,
  NavaidEntity,
  WaypointEntity,
];

export default DatabaseModuleEntities;

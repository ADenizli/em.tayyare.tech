import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  EntityRepositoryType,
} from '@mikro-orm/core';
import { TerminalProcedureEntity } from './terminalProcedure.entity';
import { WaypointEntity } from './waypoint.entity';
import { NavaidEntity } from './navaid.entity';
import { TerminalLegSpdLimitEntity } from './terminalLegSpdLimit.entity';
import { TerminalLegRepository } from '../repositories/terminalLeg.repo';

@Entity({
  repository: () => TerminalLegRepository,
  tableName: 'TerminalLegs',
})
export class TerminalLegEntity {
  [EntityRepositoryType]?: TerminalLegRepository;

  @PrimaryKey()
  id: number;

  @ManyToOne(() => TerminalProcedureEntity, { joinColumn: 'terminalID' })
  terminalID: TerminalProcedureEntity;

  @Property()
  type: string;

  @Property()
  transition: string;

  @Property()
  trackCode: string;

  @ManyToOne(() => WaypointEntity, { joinColumn: 'wptID' })
  wptID: WaypointEntity;

  @Property({ columnType: 'double' })
  wptLat: number;

  @Property({ columnType: 'double' })
  wptLon: number;

  @Property({ columnType: 'double' })
  turnDir: number;

  @ManyToOne(() => NavaidEntity, { joinColumn: 'navID' })
  navID: NavaidEntity;

  @Property({ columnType: 'double' })
  navLat: number;

  @Property({ columnType: 'double' })
  navLon: number;

  @Property({ columnType: 'double' })
  navBear: number;

  @Property({ columnType: 'double' })
  navDist: number;

  @Property({ columnType: 'double' })
  course: number;

  @Property({ columnType: 'double' })
  distance: number;

  @Property({ columnType: 'text' })
  alt: string;

  @Property({ columnType: 'double' })
  vnav: number;

  @ManyToOne(() => WaypointEntity, { joinColumn: 'centerID' })
  centerID: WaypointEntity;

  @Property({ columnType: 'double' })
  centerLat: number;

  @Property({ columnType: 'double' })
  centerLon: number;

  @Property()
  wptDescCode: string;

  @Property()
  speedLimit: TerminalLegSpdLimitEntity;
}

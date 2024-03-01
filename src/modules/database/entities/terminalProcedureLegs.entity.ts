import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToOne,
} from '@mikro-orm/core';
import { TerminalProceduresEntity } from './terminalProcedures.entity';
import { WaypointEntity } from './waypoint.entity';
import { NavaidEntity } from './navaid.entity';
import { TerminalLegSpdLimitEntity } from './terminalProceduresFixesSpdLimits.entity';

@Entity({ tableName: 'TerminalLegs' })
export class TerminalLegEntity {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => TerminalProceduresEntity, { joinColumn: 'terminalID' })
  terminalID: TerminalProceduresEntity;

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

  @Property({ columnType: 'double' })
  alt: number;

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

  @OneToOne(
    () => TerminalLegSpdLimitEntity,
    (speedLimit) => speedLimit.terminalLeg,
    { owner: true, joinColumn: 'speedLimitId' },
  )
  speedLimit: TerminalLegSpdLimitEntity;
}

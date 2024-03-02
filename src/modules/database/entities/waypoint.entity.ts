import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { NavaidEntity } from './navaid.entity';
import { WaypointRepository } from '../repositories/waypoint.repo';

@Entity({ tableName: 'Waypoints', repository: () => WaypointRepository })
export class WaypointEntity {
  @PrimaryKey()
  id: number;

  @Property()
  ident: string;

  @Property()
  collocated: boolean;

  @Property()
  name: string;

  @Property({ columnType: 'double' })
  latitude: number;

  @Property({ columnType: 'double' })
  longitude: number;

  @ManyToOne(() => NavaidEntity, { joinColumn: 'navaidID' })
  navaidID: NavaidEntity;
}

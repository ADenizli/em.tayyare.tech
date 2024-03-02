import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { AirwayEntity } from './airway.entity';
import { WaypointEntity } from './waypoint.entity';

@Entity({ tableName: 'AirwayLegs' })
export class AirwayLegEntity {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => AirwayEntity, { joinColumn: 'airwayID' })
  airwayID: number;

  @Property({ nullable: true })
  level: string;

  @ManyToOne(() => WaypointEntity, { joinColumn: 'from' })
  from: WaypointEntity;

  @ManyToOne(() => WaypointEntity, { joinColumn: 'to' })
  to: WaypointEntity;

  @Property({ fieldName: 'isStart' })
  isStart: boolean;

  @Property({ fieldName: 'isEnd' })
  isEnd: boolean;
}

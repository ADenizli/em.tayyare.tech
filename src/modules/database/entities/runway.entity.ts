import {
  Entity,
  PrimaryKey,
  Property,
  ManyToMany,
  ManyToOne,
} from '@mikro-orm/core';
import { SurfaceTypeEntity } from './surfaceType.entity'; // make sure the path is correct
import { AirportEntity } from './airport.entity';

@Entity({ tableName: 'Runways' })
export class RunwayEntity {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => AirportEntity)
  airportID: AirportEntity;

  @Property()
  ident: string;

  @Property({ columnType: 'double' })
  trueHeading: number;

  @Property()
  length: number;

  @Property()
  width: number;

  @ManyToOne(() => SurfaceTypeEntity)
  surface?: SurfaceTypeEntity;

  @Property({ columnType: 'double' })
  latitude: number;

  @Property({ columnType: 'double' })
  longitude: number;

  @Property()
  elevation: number;
}

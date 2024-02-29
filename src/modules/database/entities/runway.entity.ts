import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { SurfaceTypeEntity } from './surfaceType.entity'; // make sure the path is correct
import { AirportEntity } from './airport.entity';

@Entity({ tableName: 'Runways' })
export class RunwayEntity {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => AirportEntity, { joinColumn: 'airportID' })
  airportID: AirportEntity;

  @Property()
  ident: string;

  @Property({ columnType: 'double', fieldName: 'trueHeading' })
  trueHeading: number;

  @Property()
  length: number;

  @Property()
  width: number;

  // TODO: FIX THIS
  // @ManyToOne(() => SurfaceTypeEntity, { joinColumn: 'surface_type' })
  // surface?: SurfaceTypeEntity;

  @Property({ columnType: 'double' })
  latitude: number;

  @Property({ columnType: 'double' })
  longitude: number;

  @Property()
  elevation: number;
}

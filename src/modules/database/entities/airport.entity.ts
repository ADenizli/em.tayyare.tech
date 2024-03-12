import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { RunwayEntity } from './runway.entity';
import { AirportRepository } from '../repositories/airport.repo';

@Entity({ tableName: 'Airports', repository: () => AirportRepository })
export class AirportEntity {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property({ columnType: 'text' })
  icao: string;

  @Property({ columnType: 'double' })
  latitude: number;

  @Property({ columnType: 'double' })
  longitude: number;

  @Property()
  elevation: number;

  @Property({ nullable: true, fieldName: 'transitionAltitude' })
  transitionAltitude: number;

  @Property({ nullable: true, fieldName: 'transitionLevel' })
  transitionLevel: number;

  @OneToMany(() => RunwayEntity, (runway) => runway.airportID)
  runways: Collection<RunwayEntity> = new Collection<RunwayEntity>(this);
}

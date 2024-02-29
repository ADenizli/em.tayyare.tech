import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { RunwayEntity } from './runway.entity';

@Entity({ tableName: 'Airports' })
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

  @Property({ nullable: true })
  transitionAltitude: number;

  @Property({ nullable: true })
  transitionLevel: number;

  @OneToMany(() => RunwayEntity, (runway) => runway.airportID)
  runways: Collection<RunwayEntity> = new Collection<RunwayEntity>(this);
}

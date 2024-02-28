import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

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
}

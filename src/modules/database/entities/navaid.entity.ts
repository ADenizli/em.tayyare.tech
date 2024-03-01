import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'Navaids' })
export class NavaidEntity {
  @PrimaryKey()
  id: number;

  @Property()
  ident: string;

  @Property()
  type: number;

  @Property()
  name: string;

  @Property()
  freq: number;

  @Property()
  channel: string;

  @Property()
  usage: string;

  @Property({ columnType: 'double' })
  latitude: number;

  @Property({ columnType: 'double' })
  longitude: number;

  @Property()
  elevation: number;

  @Property({ columnType: 'double', fieldName: 'slavedVar' })
  slavedVar: number;

  @Property({ columnType: 'double', fieldName: 'magneticVariation' })
  magneticVariation: number;

  @Property()
  range: number;
}

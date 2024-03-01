import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { RunwayEntity } from './runway.entity';

// Due to the camelcase writing problems in SQLite3
// We mentioned fieldName in columns which have two words

@Entity({ tableName: 'ILSes' })
export class ILSEntity {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => RunwayEntity, { joinColumn: 'rwyID' })
  rwyID: RunwayEntity;

  @Property()
  freq: number;

  @Property({ columnType: 'double', fieldName: 'gsAngle' })
  gsAngle: number;

  @Property({ columnType: 'double' })
  latitude: number;

  @Property({ columnType: 'double' })
  longitude: number;

  @Property()
  category: number;

  @Property()
  ident?: string;

  @Property({ columnType: 'double', fieldName: 'locCourse' })
  locCourse: number;

  @Property({ fieldName: 'crossingHeight' })
  crossingHeight: number;

  @Property({ fieldName: 'hasDme' })
  hasDme: boolean;

  @Property()
  elevation: number;
}

import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { AirwayLegEntity } from './airwayLeg.entity';
import { AirwayRepository } from '../repositories/airway.repo';

@Entity({ tableName: 'Airways', repository: () => AirwayRepository })
export class AirwayEntity {
  @PrimaryKey()
  id: number;

  @Property()
  ident: string;

  @OneToMany(() => AirwayLegEntity, (airwayLeg) => airwayLeg.airwayID)
  legs: Collection<AirwayLegEntity> = new Collection<AirwayLegEntity>(this);
}

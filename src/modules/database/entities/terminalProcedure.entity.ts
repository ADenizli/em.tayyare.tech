import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { ILSEntity } from './ils.entity';
import { AirportEntity } from './airport.entity';
import { RunwayEntity } from './runway.entity';
import { TerminalProcedureRepository } from '../repositories/terminalProcedure.repo';

@Entity({
  tableName: 'TerminalProcedures',
  repository: () => TerminalProcedureRepository,
})
export class TerminalProcedureEntity {
  @PrimaryKey()
  id: number;

  @ManyToOne(() => AirportEntity, { joinColumn: 'airportID' })
  airportID: AirportEntity;

  @Property()
  proc: string;

  @Property()
  icao: string;

  @Property({ fieldName: 'fullName' })
  fullName: string;

  @Property()
  name: string;

  @Property()
  rwy: string;

  @ManyToOne(() => RunwayEntity, { joinColumn: 'rwyID' })
  rwyID: RunwayEntity;

  @ManyToOne(() => ILSEntity, { joinColumn: 'ilsID' })
  ilsID: ILSEntity;
}

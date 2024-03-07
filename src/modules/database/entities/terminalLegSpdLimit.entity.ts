import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import ESpeedLimitDesc from '../enums/SpeedLimitDesc';

@Entity({ tableName: 'TerminalLegsEx' })
export class TerminalLegSpdLimitEntity {
  @PrimaryKey()
  id: number;

  @Property({ fieldName: 'isFlyOver' })
  isFlyOver: boolean;

  @Property({ fieldName: 'speedLimit' })
  speedLimit: number;

  @Property({ fieldName: 'speedLimitDescription' })
  speedLimitDescription: ESpeedLimitDesc;
}

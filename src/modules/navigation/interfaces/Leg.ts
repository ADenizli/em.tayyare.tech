import IPosition from '@modules/common/interfaces/Position';
import ELegType from '../enums/LegType';

export default interface ILeg {
  type: ELegType;
  ident: string;
  position: IPosition;
  restrictions?: {
    maxAlt?: number;
    minAlt?: number;
    maxSpd?: number;
    minSpd?: number;
  };
  togo?: number;
  course?: number;
}

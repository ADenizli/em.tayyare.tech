import IPosition from '@modules/common/interfaces/Position';
import IFix from './Fix';
import INavaid from './Navaid';

export default interface IAirway {
  ident: string;
  intersections: IFix[] | INavaid[] | IUndefinedIntersection[];
}

export interface IUndefinedIntersection {
  ident: string;
  position: IPosition;
}

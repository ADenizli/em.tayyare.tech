import IPosition from '@modules/common/interfaces/Position';

export default interface IJRunway {
  airport: string;
  ident: string;
  frequency: string;
  position: IPosition;
  course: string;
}

import IWaypoint from './Point';

export default interface IAirway {
  id: number;
  ident: string;
  legs?: IWaypoint[];
}

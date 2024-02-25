import IPosition from '@modules/common/interfaces/Position';
import EApproachConfigrations from '../enums/ApproachConfigrations';
import EDepartureConfigrations from '../enums/DepartureConfigrations';
import EnrouteConfigrationTypes from '../enums/EnrouteConfigrationTypes';
import ILeg from './Leg';

export default interface IFlight {
  gate?: string;
  position: IPosition;

  origin: string;
  // because of military purposes
  destination?: string;

  departureConfigration?: {
    type: EDepartureConfigrations;
    runway: string;
    sid?: string;
  };

  enrouteConfigration?: IEnrouteItem[];

  approachConfigration?: {
    type: EApproachConfigrations;
    runway: string;
    star?: string;
  };

  // calculated

  legs?: ILeg[];
}

export interface IEnrouteItem {
  ident: string;
  type: EnrouteConfigrationTypes;
}

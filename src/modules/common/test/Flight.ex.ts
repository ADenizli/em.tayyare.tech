import EApproachTypes from '@modules/navigation/enum/ApproachTypes';
import EDepartureTypes from '@modules/navigation/enum/DepartureTypes';
import ERouteItemTypes from '@modules/navigation/enum/RouteItemTypes';
import IFlight from '@modules/navigation/interfaces/Flight';

export const ExampleFlight: IFlight = {
  callsign: 'TYR183',
  origin: 'LTCG',
  destination: 'LTFM',
  departureProcedure: {
    sidInfo: undefined,
    sidLegs: undefined,
  },
  departureConfigration: {
    runway: '11',
    activeLandingRunway: '11',
    departureType: EDepartureTypes.SID,
    ident: 14143,
  },
  route: [
    {
      id: 43751,
      type: ERouteItemTypes.INTERSECTION,
    },
    {
      type: ERouteItemTypes.AIRWAY,
      id: 7004,
    },
    {
      type: ERouteItemTypes.INTERSECTION,
      id: 245825,
    },
    {
      type: ERouteItemTypes.AIRWAY,
      id: 5389,
    },
    {
      type: ERouteItemTypes.INTERSECTION,
      id: 43354,
    },
  ],
  approachConfigration: {
    runway: '34L',
    approachID: 45612,
    approachType: EApproachTypes.STAR,
    landingProcedure: 82098,
    transition: 'SADIK',
  },

  approachProcedure: {
    starLegs: undefined,
    starInfo: undefined,
  },

  legs: [],
};

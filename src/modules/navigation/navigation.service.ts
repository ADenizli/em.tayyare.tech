import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@modules/database/database.service';
import IFlight from './interfaces/Flight';
import EDepartureTypes from './enum/DepartureTypes';
import ERouteItemTypes from './enum/RouteItemTypes';
import ELegTypes from './enum/LegTypes';

@Injectable()
export class NavigationService {
  flight: IFlight = {
    callsign: 'TYR183',
    origin: 'LTCG',
    destination: 'LTAC',
    departureConfigration: {
      runway: '11',
      activeLandingRunway: '11',
      departureType: EDepartureTypes.SID,
      ident: 'TEME1A',
    },
    route: [
      {
        type: ERouteItemTypes.INTERSECTION,
        ident: 'TEMEL',
      },
      {
        type: ERouteItemTypes.AIRWAY,
        ident: 'UW71',
      },
      {
        type: ERouteItemTypes.INTERSECTION,
        ident: 'ILHAN',
      },
    ],
    legs: [],
  };
  constructor(private readonly databaseService: DatabaseService) {}

  async generateFlightLegs() {
    // departure base
    const origin = await this.databaseService.getAirport(this.flight.origin);
    const depRnw = origin.runways.find(
      (runway) => runway.ident === this.flight.departureConfigration.runway,
    );
    this.flight.legs.push({
      type: ELegTypes.DP,
      ident: `RNW${this.flight.departureConfigration.runway}`,
      position: {
        latitude: depRnw.latitude,
        longitude: depRnw.longitude,
        elevation: depRnw.elevation,
      },
    });

    // departure configration
    if (
      this.flight.departureConfigration.departureType === EDepartureTypes.SID
    ) {
      const sid = this.databaseService.getAirportSID(
        this.flight.origin,
        this.flight.departureConfigration.ident,
      );
      // check is sid able for rnwy
      if (condition) {
      }
    }
  }
}

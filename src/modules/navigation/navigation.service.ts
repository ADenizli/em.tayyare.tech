import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@modules/database/database.service';
import IFlight from './interfaces/Flight';
import EDepartureTypes from './enum/DepartureTypes';
import ERouteItemTypes from './enum/RouteItemTypes';
import ELegTypes from './enum/LegTypes';
import { ITerminalLeg } from '@modules/database/interfaces/TerminalProcedure';
import EFlightPhases from './enum/FlightPhases';
import IPosition from '@modules/common/interfaces/Position';

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
      ident: 14143,
      sidInfo: undefined,
      sidLegs: undefined,
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
    await this.generateDepartureLegs();
  }

  async generateDepartureLegs() {
    // departure base
    const origin = await this.databaseService.getAirport(this.flight.origin);
    const depRnw = origin.runways.find(
      (runway) => runway.ident === this.flight.departureConfigration.runway,
    );
    this.flight.legs.push({
      phase: EFlightPhases.DEP_RWY,
      type: ELegTypes.DP,
      ident: `RW${this.flight.departureConfigration.runway}`,
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
      const sidInfo = await this.databaseService.getSIDByID(
        this.flight.departureConfigration.ident,
      );
      const sidLegs = await this.databaseService.getLegsOfTerminalProcedure(
        this.flight.departureConfigration.ident,
      );

      // We store them for next modules
      // It might be required in other modules
      this.flight.departureConfigration.sidInfo = sidInfo;
      this.flight.departureConfigration.sidLegs = sidLegs;

      sidLegs.forEach((leg: ITerminalLeg) => {
        if (leg.trackCode === ELegTypes.CA) {
          this.flight.legs.push({
            phase: EFlightPhases.DEP_PROC,
            type: ELegTypes[leg.trackCode],
            ident: leg.wptID.ident,
            procedure: {
              clbAlt: leg.alt.slice(-1) === 'A' && Number(leg.alt.slice(0, -1)),
              desAlt: leg.alt.slice(-1) === 'B' && Number(leg.alt.slice(0, -1)),
              course: leg.course,
            },
          });
        } else {
          if (
            this.flight.legs[this.flight.legs.length - 1].position !== undefined
          ) {
            this.flight.legs[this.flight.legs.length - 1].togo =
              this.getDistance(
                this.flight.legs[this.flight.legs.length - 1].position,
                {
                  latitude: leg.wptLat,
                  longitude: leg.wptLon,
                },
              );
          }
          this.flight.legs.push({
            phase: EFlightPhases.DEP_PROC,
            type: ELegTypes[leg.trackCode],
            ident: leg.wptID.ident,
            position: {
              latitude: leg.wptLat,
              longitude: leg.wptLon,
            },
          });
        }
      });

      console.log(this.flight.legs);
      // check is sid able for rnwy
      // if (condition) {
      // }
    }
  }

  // Helper Functions
  toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  toDegrees(radians: number): number {
    return (radians * 180) / Math.PI;
  }

  getDistance(coord1: IPosition, coord2: IPosition): number {
    const R = 6371 / 1.852; // Earth's radius in nautical miles
    const dLat = this.toRadians(coord2.latitude - coord1.latitude);
    const dLon = this.toRadians(coord2.longitude - coord1.longitude);
    const lat1 = this.toRadians(coord1.latitude);
    const lat2 = this.toRadians(coord2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

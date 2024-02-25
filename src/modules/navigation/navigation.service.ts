import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@modules/database/database.service';
import IFlight from './interfaces/Flight';
import SetRouteConfigrationDTO from './dto/SetRouteConfigration.dto';
import InitPositionDTO from './dto/InitPosition.dto';
import SetDepartureConfigrationsDTO from './dto/SetDepartureConfigrations.dto';
import ILeg from './interfaces/Leg';
import ELegType from './enums/LegType';
import EDepartureConfigrations from './enums/DepartureConfigrations';
import EnrouteConfigrationTypes from './enums/EnrouteConfigrationTypes';
import IPosition from '@modules/common/interfaces/Position';
import NavaidTypes from '@modules/database/enums/NavaidTypes';

@Injectable()
export class NavigationService {
  private flight: IFlight = {
    position: {
      latitude: 40.995599,
      longitude: 39.780809,
    },
    origin: 'LTCG',
    departureConfigration: {
      type: EDepartureConfigrations.DIRECT,
      runway: '29',
    },
    enrouteConfigration: [
      {
        type: EnrouteConfigrationTypes.POINT,
        ident: 'TEMEL',
      },
      {
        type: EnrouteConfigrationTypes.AIRWAY,
        ident: 'UW71',
      },
      {
        type: EnrouteConfigrationTypes.POINT,
        ident: 'ILHAN',
      },
    ],
  };

  constructor(private readonly databaseService: DatabaseService) {}

  serviceCheck(): string {
    return '############################\n NAV MODULE LOADED SUCCESSFULLY \n############################';
  }

  // Main Flight Functions
  initPosition(dto: InitPositionDTO) {
    this.flight = dto;
  }

  setRouteConfigration(dto: SetRouteConfigrationDTO) {
    this.flight.destination = dto.destination;
  }

  setDepartureConfigration(dto: SetDepartureConfigrationsDTO) {
    this.flight.departureConfigration.runway = dto.runway;
    this.flight.departureConfigration.type = dto.type;
    this.flight.departureConfigration.sid = dto.sid;
  }

  enRouteConfigration() {
    //TODO: check enroute validity
  }

  approachConfigration() {}

  createFlightLegs() {
    const legs: ILeg[] = [];
    if (this.flight.origin && this.flight.position) {
      if (this.flight.departureConfigration) {
        const depAirport = this.databaseService.getAirportData(
          this.flight.origin,
        );

        legs.push({
          type: ELegType.DEPARTURE,
          ident:
            depAirport.runways[this.flight.departureConfigration.runway]?.ident,
          position:
            depAirport.runways[this.flight.departureConfigration.runway]
              ?.position,
        });
        if (
          this.flight.departureConfigration.type === EDepartureConfigrations.SID
        ) {
          // create sid legs
        }
        if (this.flight.enrouteConfigration.length > 0) {
          this.flight.enrouteConfigration.forEach((enrouteItem, index) => {
            if (
              index === 0 &&
              enrouteItem.type === EnrouteConfigrationTypes.AIRWAY
            ) {
              // TODO: return first point error
            } else if (
              (index !== 0 &&
                enrouteItem.type === EnrouteConfigrationTypes.AIRWAY &&
                this.flight.enrouteConfigration[index - 1].type ===
                  EnrouteConfigrationTypes.AIRWAY) ||
              (index !== 0 &&
                enrouteItem.type === EnrouteConfigrationTypes.AIRWAY &&
                this.flight.enrouteConfigration[index + 1].type ===
                  EnrouteConfigrationTypes.AIRWAY)
            ) {
              // TODO: return double airway error
            }
            if (enrouteItem.type === EnrouteConfigrationTypes.POINT) {
              let point: IPosition;

              const isValidFix = this.databaseService.getFixesByIdent(
                enrouteItem.ident,
              );
              const isValidNavaid = this.databaseService.getNavaidByIdent(
                enrouteItem.ident,
              );

              if (isValidNavaid && Array.isArray(isValidNavaid)) {
                point = isValidNavaid.find(
                  (navaid) =>
                    navaid.type !== NavaidTypes.ILS &&
                    navaid.type !== NavaidTypes.ILSD,
                ).position;
              } else if (isValidNavaid && !Array.isArray(isValidNavaid)) {
                point = isValidNavaid.position;
              } else if (isValidFix && Array.isArray(isValidFix)) {
                // TODO: FIX 0 PROBLEM
                point = isValidFix[0].position;
              } else if (isValidFix && !Array.isArray(isValidFix)) {
                point = isValidFix.position;
              } else {
                return 'error';
              }
              if (index !== 0) {
                console.log(this.flight.legs);
                this.flight.legs[-1].togo = this.getDistance(
                  this.flight.legs[-1].position,
                  point,
                );
              }
              if (this.flight.legs) {
                this.flight.legs.push({
                  type: ELegType.INTERSECTION,
                  ident: enrouteItem.ident,
                  position: point,
                });
              } else {
                this.flight.legs = [
                  {
                    type: ELegType.INTERSECTION,
                    ident: enrouteItem.ident,
                    position: point,
                  },
                ];
              }
            } else if (enrouteItem.type === EnrouteConfigrationTypes.AIRWAY) {
              const initialIntersection =
                this.flight.enrouteConfigration[index - 1];

              const exitingIntersection =
                this.flight.enrouteConfigration[index + 1];

              const airwayIntersections = this.databaseService.getAirwayByIdent(
                enrouteItem.ident.trim(),
              )?.intersections;

              if (airwayIntersections) {
                const requiredIntersections = airwayIntersections.slice(
                  airwayIntersections
                    .map((intersection) => intersection.ident)
                    .indexOf(initialIntersection.ident),
                  airwayIntersections
                    .map((intersection) => intersection.ident)
                    .indexOf(exitingIntersection.ident) + 1,
                );
                requiredIntersections.forEach((intersection) => {
                  this.flight.legs[-1].togo = this.getDistance(
                    this.flight.legs[-1].position,
                    intersection.position,
                  );
                  this.flight.legs.push({
                    type: ELegType.INTERSECTION,
                    ident: intersection.ident,
                    position: intersection.position,
                  });
                });
              } else {
                console.log(this.databaseService.getAirwayByIdent('UW71'));
              }
            }
          });
        }
      } else {
        this.flight.legs = legs;
      }
    } else {
      // return origin and position error
    }
    console.log(this.flight.legs);
  }

  getFlight() {
    console.log(this.flight);
  }

  compleateFlight() {}

  positionUpdate() {}

  // Additional Flight Functions
  planHold() {}

  immediateHold() {}

  planOrbit() {}

  immediateOrbit() {}

  createWaypoint() {}

  deleteWaypoint() {}

  setRestrictions() {}

  direct() {}

  directIntercept() {}

  offset() {}

  divert() {}

  // Recycle Navigation System

  // Helpers
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

  toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}

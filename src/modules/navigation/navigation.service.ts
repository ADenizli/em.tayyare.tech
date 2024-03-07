import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@modules/database/database.service';
import IFlight from './interfaces/Flight';
import EDepartureTypes from './enum/DepartureTypes';
import ERouteItemTypes from './enum/RouteItemTypes';
import ELegTypes from './enum/LegTypes';
import { ITerminalLeg } from '@modules/database/interfaces/TerminalProcedure';
import EFlightPhases from './enum/FlightPhases';
import IPosition from '@modules/common/interfaces/Position';
import magvar from 'magvar';
import { ROUTE_DISCONTUNITY } from './navigation.constants';
import IWaypoint from '@modules/database/interfaces/Point';
import EApproachTypes from './enum/ApproachTypes';

@Injectable()
export class NavigationService {
  flight: IFlight = {
    callsign: 'TYR183',
    origin: 'LTCG',
    destination: 'LTFM',
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
        ident: 'BUK',
      },
      {
        type: ERouteItemTypes.AIRWAY,
        ident: 'UA4',
      },
      {
        type: ERouteItemTypes.INTERSECTION,
        ident: 'ERSEN',
      },
    ],
    approachConfigration: {
      runway: '34L',
      approachID: 45612,
      approachType: EApproachTypes.STAR,
      starLegs: undefined,
      starInfo: undefined,
      landingProcedure: 82098,
      transition: 'SADIK',
    },

    legs: [],
  };
  constructor(private readonly databaseService: DatabaseService) {}

  async generateFlightLegs() {
    await this.generateDepartureLegs();
    await this.generateEnrouteLegs();
    await this.generateApproachLegs();
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
      const sidInfo = await this.databaseService.getTerminalProcedureByID(
        this.flight.departureConfigration.ident,
      );
      const sidLegs = await this.databaseService.getLegsOfTerminalProcedure(
        this.flight.departureConfigration.ident,
      );

      // We store them for next modules
      // It might be required in other modules
      this.flight.departureConfigration.sidInfo = sidInfo;
      this.flight.departureConfigration.sidLegs = sidLegs;

      sidLegs.forEach((leg: ITerminalLeg, index: number) => {
        if (leg.trackCode === ELegTypes.CA) {
          this.flight.legs.push({
            phase: EFlightPhases.DEP_PROC,
            type: ELegTypes[leg.trackCode],
            ident: `(INT${Number(leg.alt.slice(0, -1)).toString() + leg.alt.slice(-1)})`,
            procedure: {
              clbAlt:
                leg.alt.slice(-1) === 'A'
                  ? Number(leg.alt.slice(0, -1))
                  : undefined,
              desAlt:
                leg.alt.slice(-1) === 'B'
                  ? Number(leg.alt.slice(0, -1))
                  : undefined,
              course: leg.course,
            },
            restrictions: {
              atAlt: Number(leg.alt.slice(0, -1)),
              maxSpd:
                leg.speedLimit.speedLimitDescription === 'A'
                  ? leg.speedLimit.speedLimit
                  : undefined,
              atSpd:
                leg.speedLimit.speedLimitDescription === null
                  ? leg.speedLimit.speedLimit
                  : undefined,
              minSpd:
                leg.speedLimit.speedLimitDescription === 'B'
                  ? leg.speedLimit.speedLimit
                  : undefined,
            },
          });
        } else {
          if (
            this.flight.legs[this.flight.legs.length - 1].position !== undefined
          ) {
            const previusIndex = this.flight.legs.length - 1;
            const previusLeg = this.flight.legs[previusIndex];
            this.flight.legs[previusIndex].togo = parseFloat(
              this.getDistance(this.flight.legs[previusIndex].position, {
                latitude: leg.wptLat,
                longitude: leg.wptLon,
              }).toFixed(1),
            );
            const trueHeading = this.calculateTrueHeading(previusLeg.position, {
              latitude: leg.wptLat,
              longitude: leg.wptLon,
            });
            this.flight.legs[previusIndex].trueHeading = trueHeading;
            this.flight.legs[previusIndex].followHeading =
              this.calculateMagneticHeading(previusLeg.position, trueHeading);
          }
          const minAltLimit = leg.alt
            ? this.getAltitudeRestriction(leg.alt, 'A')
            : undefined;
          const maxAltLimit = leg.alt
            ? this.getAltitudeRestriction(leg.alt, 'B')
            : undefined;
          const atAltLimit =
            !minAltLimit &&
            !maxAltLimit &&
            leg.alt !== 'MAP' &&
            leg.alt !== null
              ? Number(leg.alt)
              : undefined;
          this.flight.legs.push({
            phase: EFlightPhases.DEP_PROC,
            type:
              index !== sidLegs.length - 1
                ? ELegTypes[leg.trackCode]
                : ELegTypes.IF,
            ident: leg.wptID.ident,
            position: {
              latitude: leg.wptLat,
              longitude: leg.wptLon,
            },

            restrictions: {
              maxAlt: maxAltLimit,
              atAlt: atAltLimit,
              minAlt: minAltLimit,
              maxSpd:
                leg.speedLimit.speedLimitDescription === 'A'
                  ? leg.speedLimit.speedLimit
                  : undefined,
              atSpd:
                leg.speedLimit.speedLimitDescription === null
                  ? leg.speedLimit.speedLimit
                  : undefined,
              minSpd:
                leg.speedLimit.speedLimitDescription === 'B'
                  ? leg.speedLimit.speedLimit
                  : undefined,
            },
          });
        }
      });

      // check is sid able for rnwy
      // if (condition) {
      // }
    }
  }

  async generateEnrouteLegs() {
    const initialFix = this.flight.legs.find(
      (leg) => leg.type === ELegTypes.IF,
    );
    let prevLegIndex = this.flight.legs.length - 1;

    for (const routeItem of this.flight.route) {
      const index = this.flight.route.indexOf(routeItem);
      const prevEnrouteItem = index !== 0 && this.flight.route[index - 1];
      const nextEnrouteItem =
        index !== this.flight.route.length - 1 && this.flight.route[index + 1];
      console.log(routeItem);
      if (routeItem.type === ERouteItemTypes.INTERSECTION) {
        let getIntersectionInformation: IWaypoint | IWaypoint[] =
          await this.databaseService.getWPTByIdent(routeItem.ident);
        getIntersectionInformation = getIntersectionInformation[0];

        if (index === 0) {
          if (initialFix.ident !== routeItem.ident) {
            this.flight.legs.push(ROUTE_DISCONTUNITY);

            this.flight.legs.push({
              phase: EFlightPhases.ENROUTE,
              type: ELegTypes.IF,
              ident: getIntersectionInformation.ident,
              position: {
                latitude: getIntersectionInformation.latitude,
                longitude: getIntersectionInformation.longitude,
              },
            });
            prevLegIndex++;
          }
        } else if (index === this.flight.route.length - 1) {
          this.flight.legs.push({
            phase: EFlightPhases.ENROUTE,
            type: ELegTypes.AI,
            ident: getIntersectionInformation.ident,
            position: {
              latitude: getIntersectionInformation.latitude,
              longitude: getIntersectionInformation.longitude,
            },
          });
          this.setLegHeadingAndDistanceOnEnroute(
            prevLegIndex,
            getIntersectionInformation,
          );
          prevLegIndex++;
        } else {
          this.flight.legs.push({
            phase: EFlightPhases.ENROUTE,
            type: ELegTypes.CF,
            ident: getIntersectionInformation.ident,
            position: {
              latitude: getIntersectionInformation.latitude,
              longitude: getIntersectionInformation.longitude,
            },
          });

          this.setLegHeadingAndDistanceOnEnroute(
            prevLegIndex,
            getIntersectionInformation,
          );
          prevLegIndex++;
        }
      } else if (routeItem.type === ERouteItemTypes.AIRWAY) {
        const airway = await this.databaseService.getAirwayWaypoints(
          routeItem.ident,
        );

        const firstLegIndex = airway.legs.indexOf(
          airway.legs.find((leg) => leg.ident === prevEnrouteItem.ident),
        );

        const lastLegIndex = airway.legs.indexOf(
          airway.legs.find((leg) => leg.ident === nextEnrouteItem.ident),
        );

        let requiredLegs: IWaypoint[];

        if (firstLegIndex > lastLegIndex) {
          requiredLegs = airway.legs
            .slice(lastLegIndex + 1, firstLegIndex)
            .reverse();
        } else {
          requiredLegs = airway.legs.slice(firstLegIndex + 1, lastLegIndex);
        }

        for (const leg of requiredLegs) {
          this.flight.legs.push({
            phase: EFlightPhases.ENROUTE,
            type: ELegTypes.CF,
            ident: leg.ident,
            position: {
              latitude: leg.latitude,
              longitude: leg.longitude,
            },
          });
          this.setLegHeadingAndDistanceOnEnroute(prevLegIndex, leg);
          prevLegIndex++;
        }
      } else {
        return 'error';
      }
    }
  }

  async generateApproachLegs() {
    if (
      this.flight.approachConfigration.approachType === EApproachTypes.VECTORS
    ) {
      this.flight.legs.push({
        phase: EFlightPhases.APP_PROC,
        type: ELegTypes.VC,
        ident: '(VECTORS)',
      });
    } else {
      const starInfo = await this.databaseService.getTerminalProcedureByID(
        this.flight.approachConfigration.approachID,
      );

      this.flight.approachConfigration.starInfo = starInfo;

      const starLegs = await this.databaseService.getLegsOfTerminalProcedure(
        this.flight.approachConfigration.approachID,
      );

      const runwayFilteredStarLegs = starLegs.filter(
        (leg) =>
          leg.transition === 'ALL' ||
          leg.transition === `RW${this.flight.approachConfigration.runway}`,
      );

      let prevLegIndex = this.flight.legs.length - 1;
      for (const leg of runwayFilteredStarLegs) {
        const position = {
          latitude: leg.wptLat,
          longitude: leg.wptLon,
        };

        const minAltLimit = leg.alt
          ? this.getAltitudeRestriction(leg.alt, 'A')
          : undefined;
        const maxAltLimit = leg.alt
          ? this.getAltitudeRestriction(leg.alt, 'B')
          : undefined;
        const atAltLimit =
          !minAltLimit && !maxAltLimit && leg.alt !== 'MAP' && leg.alt !== null
            ? Number(leg.alt)
            : undefined;

        if (leg.type === '6') {
          const previusLeg = this.flight.legs[prevLegIndex];
          if (previusLeg.ident !== leg.wptID.ident) {
            this.flight.legs.push({
              phase: EFlightPhases.APP_PROC,
              type: leg.type as ELegTypes,
              ident: leg.wptID.ident,
              position,
              restrictions: {
                atAlt: atAltLimit,
                minAlt: minAltLimit,
                maxAlt: maxAltLimit,
                maxSpd:
                  leg.speedLimit.speedLimitDescription === 'A'
                    ? leg.speedLimit.speedLimit
                    : undefined,
                atSpd:
                  leg.speedLimit.speedLimitDescription === null
                    ? leg.speedLimit.speedLimit
                    : undefined,
                minSpd:
                  leg.speedLimit.speedLimitDescription === 'B'
                    ? leg.speedLimit.speedLimit
                    : undefined,
              },
              transition: true,
            });

            this.setLegHeadingAndDistanceOnEnroute(prevLegIndex, position);

            prevLegIndex++;
          }
        } else {
          this.flight.legs.push({
            phase: EFlightPhases.APP_PROC,
            type: leg.type as ELegTypes,
            ident: leg.wptID.ident,
            position,
            restrictions: {
              atAlt: atAltLimit,
              minAlt: minAltLimit,
              maxAlt: maxAltLimit,
              maxSpd:
                leg.speedLimit.speedLimitDescription === 'A'
                  ? leg.speedLimit.speedLimit
                  : undefined,
              atSpd:
                leg.speedLimit.speedLimitDescription === null
                  ? leg.speedLimit.speedLimit
                  : undefined,
              minSpd:
                leg.speedLimit.speedLimitDescription === 'B'
                  ? leg.speedLimit.speedLimit
                  : undefined,
            },
          });

          this.setLegHeadingAndDistanceOnEnroute(prevLegIndex, position);

          prevLegIndex++;
        }
      }
    }
  }

  async generateLandingLegs() {
    const landingProcedure =
      await this.databaseService.getTerminalProcedureByID(
        this.flight.approachConfigration.landingProcedure,
      );

    const landingProcedureLegs =
      await this.databaseService.getLegsOfTerminalProcedure(
        this.flight.approachConfigration.landingProcedure,
      );

    const transitionProcLegs = landingProcedureLegs.filter(
      (proc) =>
        proc.type === 'A' &&
        proc.transition === this.flight.approachConfigration.transition,
    );
    const ilsProcLegs = landingProcedureLegs.filter(
      (proc) => proc.type === 'I',
    );

    let prevLegIndex = this.flight.legs.length - 1;
    transitionProcLegs.forEach((leg) => {

      if () {
        
      }
      const position = {
        latitude: leg.wptLat,
        longitude: leg.wptLon,
      };

      const minAltLimit = leg.alt
        ? this.getAltitudeRestriction(leg.alt, 'A')
        : undefined;
      const maxAltLimit = leg.alt
        ? this.getAltitudeRestriction(leg.alt, 'B')
        : undefined;
      const atAltLimit =
        !minAltLimit && !maxAltLimit && leg.alt !== 'MAP' && leg.alt !== null
          ? Number(leg.alt)
          : undefined;

      this.flight.legs.push({
        phase: EFlightPhases.TRS_PROC,
        type: leg.type as ELegTypes,
        ident: leg.wptID.ident,
        position,
        restrictions: {
          atAlt: atAltLimit,
          minAlt: minAltLimit,
          maxAlt: maxAltLimit,
          maxSpd:
            leg.speedLimit.speedLimitDescription === 'A'
              ? leg.speedLimit.speedLimit
              : undefined,
          atSpd:
            leg.speedLimit.speedLimitDescription === null
              ? leg.speedLimit.speedLimit
              : undefined,
          minSpd:
            leg.speedLimit.speedLimitDescription === 'B'
              ? leg.speedLimit.speedLimit
              : undefined,
        },
      });

      this.setLegHeadingAndDistanceOnEnroute(prevLegIndex, position);

      prevLegIndex++;
    });

    ilsProcLegs.forEach((leg) => {
      const position = {
        latitude: leg.wptLat,
        longitude: leg.wptLon,
      };

      const minAltLimit = leg.alt
        ? this.getAltitudeRestriction(leg.alt, 'A')
        : undefined;
      const maxAltLimit = leg.alt
        ? this.getAltitudeRestriction(leg.alt, 'B')
        : undefined;
      const atAltLimit =
        !minAltLimit && !maxAltLimit && leg.alt !== 'MAP' && leg.alt !== null
          ? Number(leg.alt)
          : undefined;

      this.flight.legs.push({
        phase: EFlightPhases.LND_PROC,
        type: leg.type as ELegTypes,
        ident: leg.wptID.ident,
        position,
        restrictions: {
          atAlt: atAltLimit,
          minAlt: minAltLimit,
          maxAlt: maxAltLimit,
          maxSpd:
            leg.speedLimit.speedLimitDescription === 'A'
              ? leg.speedLimit.speedLimit
              : undefined,
          atSpd:
            leg.speedLimit.speedLimitDescription === null
              ? leg.speedLimit.speedLimit
              : undefined,
          minSpd:
            leg.speedLimit.speedLimitDescription === 'B'
              ? leg.speedLimit.speedLimit
              : undefined,
        },
      });

      this.setLegHeadingAndDistanceOnEnroute(prevLegIndex, position);

      prevLegIndex++;
    });
    console.log(landingProcedure);
  }

  async getFlightLegs() {
    console.log(this.flight.legs);
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
    return parseFloat((R * c).toFixed(1));
  }

  getAltitudeRestriction(input: string, type: string) {
    const index = input.indexOf(type); // Find the index of the letter referance type
    if (index >= 5) {
      // If referance type is found after the fifth character
      return Number(input.substring(index - 5, index)); // Get the 5 characters before referance type
    } else if (index > 0) {
      // If referance type is found but before the fifth character
      return Number(input.substring(0, index)); // Get all characters from the start to referance type
    }
    return undefined; // If referance type is not found or is at the start, return an empty string
  }

  calculateTrueHeading(coord1: IPosition, coord2: IPosition): number {
    const startLat = this.toRadians(coord1.latitude);
    const startLng = this.toRadians(coord1.longitude);
    const destLat = this.toRadians(coord2.latitude);
    const destLng = this.toRadians(coord2.longitude);

    const y = Math.sin(destLng - startLng) * Math.cos(destLat);
    const x =
      Math.cos(startLat) * Math.sin(destLat) -
      Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);

    const heading = this.toDegrees(Math.atan2(y, x));

    // Convert heading to a bearing value (0° - 360°)
    return Math.round((heading + 360) % 360);
  }

  calculateMagneticHeading(coord1: IPosition, heading: number): number {
    // Get the magnetic declination
    const declination = magvar.get(coord1.latitude, coord1.longitude);

    // Adjust the true heading with the magnetic declination to get the magnetic heading
    const magneticHeading = (heading - declination + 360) % 360;
    return Math.round(magneticHeading);
  }

  setLegHeadingAndDistanceOnEnroute(prevLegIndex, getIntersectionInformation) {
    const intersectionPosition: IPosition = {
      latitude: getIntersectionInformation.latitude,
      longitude: getIntersectionInformation.longitude,
    };

    const trueHeading = this.calculateTrueHeading(
      this.flight.legs[prevLegIndex].position,
      intersectionPosition,
    );

    const magneticHeading = this.calculateMagneticHeading(
      this.flight.legs[prevLegIndex].position,
      trueHeading,
    );

    const togo = this.getDistance(
      this.flight.legs[prevLegIndex].position,
      intersectionPosition,
    );

    this.flight.legs[prevLegIndex].togo = togo;
    this.flight.legs[prevLegIndex].trueHeading = trueHeading;
    this.flight.legs[prevLegIndex].followHeading = magneticHeading;
  }
}

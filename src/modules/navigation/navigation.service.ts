import { ExampleFlight } from '@modules/common/test/Flight.ex';
import IFlight, {
  ICompassDirections,
  ILeg,
  ILegAltitudeRestrictions,
  ILegSpeedRestrictions,
} from './interfaces/Flight';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@modules/database/database.service';
import IPosition from '@modules/common/interfaces/Position';
import magvar from 'magvar';
import { IRunway } from '@modules/database/interfaces/Airport';
import ELegTypes from './enum/LegTypes';
import EFlightPhases from './enum/FlightPhases';
import IWaypoint from '@modules/database/interfaces/Point';
import EDepartureTypes from './enum/DepartureTypes';
import { ITerminalLeg } from '@modules/database/interfaces/TerminalProcedure';
import IResponseLog from '@modules/common/interfaces/ResponseLog';
import ERouteItemTypes from './enum/RouteItemTypes';
import { ROUTE_DISCONTUNITY } from './navigation.constants';
import EApproachTypes from './enum/ApproachTypes';
import ELandingTypes from './enum/LandingTypes';

@Injectable()
export class NavigationService {
  // We are using example flight until getting data from simulator
  private flight: IFlight = ExampleFlight;

  // Defined database service
  constructor(private readonly databaseService: DatabaseService) {}

  // Initial Flight Operations
  async generateFlightLegs() {
    const departurePhaseLog: IResponseLog = await this.generateDeparturePhase();
    if (departurePhaseLog) {
      console.log('TODO:');
    }
    await this.generateEnroutePhase();
    await this.generateApproachPhase();
    await this.generateLandingPhase();
    console.log(this.flight.legs);
    // await this.generateGoAroundLegs();
  }

  // ###############
  // Departure Phase
  // ###############

  async generateDeparturePhase() {
    const departureConfigration = this.flight.departureConfigration;

    const origin = await this.databaseService.getAirport(this.flight.origin);

    // Departure Runway Leg Generation
    const depRwy = origin.runways.find(
      (runway) => runway.ident === departureConfigration.runway,
    );

    this.flight.legs.push(
      this.generateRunwayLeg(depRwy, EFlightPhases.DEP_RWY),
    );

    // Departure Procedure Leg Generation
    switch (departureConfigration.departureType) {
      case EDepartureTypes.SID:
        // #### SID Procedures ####
        const sidInfo = await this.databaseService.getTerminalProcedureByID(
          this.flight.departureConfigration.ident,
        );
        const sidLegs = await this.databaseService.getLegsOfTerminalProcedure(
          this.flight.departureConfigration.ident,
        );
        // We store them for next modules
        // It might be required in other modules
        this.flight.departureProcedure.sidInfo = sidInfo;
        this.flight.departureProcedure.sidLegs = sidLegs;

        // Loop for SID Legs
        for (const sidLeg of sidLegs) {
          this.flight.legs.push(
            this.generateTerminalLeg(sidLeg, EFlightPhases.DEP_PROC),
          );
        }
        break;
      case EDepartureTypes.HEADING:
        // TODO:
        break;
      default:
        return {
          error: true,
          code: 'NVM001',
          message: 'UNDEFINED DEPARTURE TYPE DETECTED',
        };
    }
  }

  // ######################
  // Generate Enroute Phase
  // ######################

  async generateEnroutePhase() {
    let index = 0;
    let prevLegIndex = this.flight.legs.length - 1;

    for (const routeItem of this.flight.route) {
      switch (routeItem.type) {
        case ERouteItemTypes.INTERSECTION:
          const intersectionInformation: IWaypoint =
            await this.databaseService.getWPTByID(routeItem.id);

          // ############ CHECK THIS CODE FOR OPTIMIZATION ############
          if (index === 0) {
            if (
              this.flight.legs[prevLegIndex].ident !==
              intersectionInformation.ident
            ) {
              this.flight.legs.push(ROUTE_DISCONTUNITY);
              prevLegIndex++;
            }
          }
          // ########## END CHECK THIS CODE FOR OPTIMIZATION ###########
          else {
            this.flight.legs.push(
              this.generateWaypointLeg(
                intersectionInformation,
                EFlightPhases.ENROUTE,
              ),
            );
          }
          prevLegIndex++;
          break;
        case ERouteItemTypes.AIRWAY:
          const airway = await this.databaseService.getAirwayWaypointsByID(
            routeItem.id,
          );

          const prevEnrouteItem =
            index !== 0 ? this.flight.route[index - 1] : undefined;
          const nextEnrouteItem =
            index !== this.flight.route.length - 1 &&
            this.flight.route[index + 1];

          const firstLegIndex = airway.legs.indexOf(
            airway.legs.find((leg) => leg.id === prevEnrouteItem.id),
          );

          const lastLegIndex = airway.legs.indexOf(
            airway.legs.find((leg) => leg.id === nextEnrouteItem.id),
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
            this.flight.legs.push(
              this.generateWaypointLeg(leg, EFlightPhases.ENROUTE),
            );
            prevLegIndex++;
          }
          break;

        default:
          return {
            error: true,
            code: 'NVM002',
            message: 'ROUTE ITEM TYPE IS UNKNOWN',
          };
      }

      index++;
    }
  }

  // #######################
  // Generate Approach Phase
  // #######################

  async generateApproachPhase() {
    switch (this.flight.approachConfigration.approachType) {
      case EApproachTypes.STAR:
        const { approachConfigration } = this.flight;
        const starInfo = await this.databaseService.getTerminalProcedureByID(
          approachConfigration.approachID,
        );
        const starLegs = await this.databaseService.getLegsOfTerminalProcedure(
          approachConfigration.approachID,
        );

        // Set them to approach procedure variable to use on next time

        this.flight.approachProcedure.starInfo = starInfo;
        this.flight.approachProcedure.starLegs = starLegs;

        // Just get all procedures and our runways legs!
        const filteredStarLegs = starLegs.filter(
          (leg) =>
            leg.transition === 'ALL' ||
            leg.transition === `RW${approachConfigration.runway}`,
        );

        for (const leg of filteredStarLegs) {
          // If procedure has already contains transition waypoints before,
          // FMS should pass them without pushing

          const isAlreadyDeclared = this.flight.legs.some(
            (declaredLeg) => declaredLeg.ident === leg.wptID.ident,
          );
          if (leg.transition !== 'ALL' && !isAlreadyDeclared) {
            this.flight.legs.push(
              this.generateTerminalLeg(leg, EFlightPhases.APP_PROC),
            );
          } else {
            this.flight.legs.push(
              this.generateTerminalLeg(leg, EFlightPhases.APP_PROC),
            );
          }
        }
        break;

      default:
        break;
    }
  }

  // #######################
  // Generate Landing Phase
  // #######################

  async generateLandingPhase() {
    const { approachConfigration } = this.flight;
    const landingInfo = await this.databaseService.getTerminalProcedureByID(
      approachConfigration.landingProcedure,
    );
    const landingLegs = await this.databaseService.getLegsOfTerminalProcedure(
      approachConfigration.landingProcedure,
    );

    const landingType: ELandingTypes | null =
      this.getLandingProcedureFromRawLandingData(landingInfo.fullName);

    // If undefined landing type entered, FMS should return failure
    // Then, push visual approach procedures if needed TODO:
    if (landingType === null) {
      return {
        error: true,
        code: 'NVM003',
        message: 'Unidentifined landing type has been entered',
      };
    }

    // Just get required landing legs with transition legs
    const landingLegsWithTransition = landingLegs.filter(
      (leg) =>
        leg.transition === approachConfigration.transition ||
        leg.transition.length === 0,
    );
    for (const leg of landingLegsWithTransition) {
      // If procedure has already contains transition waypoints before,
      // FMS should pass them without pushing

      const isAlreadyDeclared = this.flight.legs.some(
        (declaredLeg) => declaredLeg.ident === leg.wptID.ident,
      );

      if (!isAlreadyDeclared) {
        this.flight.legs.push(
          this.generateTerminalLeg(leg, EFlightPhases.TRS_PROC),
        );
      }
    }
  }

  // Helper functions

  // #########################
  // Get Altitude Restrictions
  // #########################
  // HOW TO USE?
  // Due to the our database provider, altitude restriction value comes like XXXXXAYYYYYB or ZZZZZ
  // We get an altitude restrictions object from this function
  // You have to input raw database value of altitude restrictions
  getAltitudeRestriction(
    rawAltitudeRestriction: string,
  ): ILegAltitudeRestrictions | undefined {
    const altitudeRestrictions: ILegAltitudeRestrictions = {
      minAlt: undefined,
      atAlt: undefined,
      maxAlt: undefined,
    };

    // Minimum Level Restrictions
    const aboveRestrictionIndex = rawAltitudeRestriction.indexOf('A');
    if (aboveRestrictionIndex >= 5) {
      altitudeRestrictions.minAlt = Number(
        rawAltitudeRestriction.substring(
          aboveRestrictionIndex - 5,
          aboveRestrictionIndex,
        ),
      );
    } else if (aboveRestrictionIndex > 0) {
      altitudeRestrictions.minAlt = Number(
        rawAltitudeRestriction.substring(0, aboveRestrictionIndex),
      );
    }

    // Maximum Level Restrictions
    const belowRestrictionIndex = rawAltitudeRestriction.indexOf('B');
    if (belowRestrictionIndex >= 5) {
      altitudeRestrictions.maxAlt = Number(
        rawAltitudeRestriction.substring(
          belowRestrictionIndex - 5,
          belowRestrictionIndex,
        ),
      );
    } else if (belowRestrictionIndex > 0) {
      altitudeRestrictions.maxAlt = Number(
        rawAltitudeRestriction.substring(0, belowRestrictionIndex),
      );
    }

    // At Level Restrictions
    if (
      rawAltitudeRestriction !== 'MAP' &&
      rawAltitudeRestriction !== null &&
      !altitudeRestrictions.maxAlt &&
      !altitudeRestrictions.minAlt
    ) {
      altitudeRestrictions.atAlt = Number(rawAltitudeRestriction);
    }

    return altitudeRestrictions;
  }

  // ######################
  // Get Speed Restrictions
  // ######################
  // HOW TO USE?
  // Due to the our database provider, speed limit value comes in two parts as limit and description
  // We get a speed restrictions object from this function
  // You have to input raw database value of limit and description
  getSpeedRestriction(limit: number | null, description: string | null) {
    let speedRestriction: ILegSpeedRestrictions;

    if (limit === null) {
      return undefined;
    } else if (description === 'A') {
      speedRestriction.minSpd = limit;
    } else if (description === 'B') {
      speedRestriction.maxSpd = limit;
    } else {
      speedRestriction.atSpd = limit;
    }

    return speedRestriction;
  }

  // ##############################################
  // Geographical Distance and Heading Calculations
  // ##############################################
  toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  toDegrees(radians: number): number {
    return (radians * 180) / Math.PI;
  }

  // To get distance between two points.
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

  // To calculate true and magnetic heading between two points.
  // Warning! coord1 has defined as location of aircraft compass
  calculateHeading(coord1: IPosition, coord2: IPosition): ICompassDirections {
    let compassDirections: ICompassDirections;

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
    compassDirections.trueHeading = Math.round((heading + 360) % 360);
    compassDirections.magneticHeading =
      this.calculateMagneticHeadingDependingOnTrueHeading(
        coord1,
        compassDirections.trueHeading,
      );

    return compassDirections;
  }

  calculateMagneticHeadingDependingOnTrueHeading(
    coord1: IPosition,
    heading: number,
  ) {
    // Get the magnetic declination
    const declination = magvar.get(coord1.latitude, coord1.longitude);

    // Adjust the true heading with the magnetic declination to get the magnetic heading
    return Math.round((heading - declination + 360) % 360);
  }

  // #############################################
  // Leg Generators | Runway & Waypoints & Navaids
  // #############################################

  generateRunwayLeg(
    runwayInformations: IRunway,
    phase: EFlightPhases.ARR_RWY | EFlightPhases.DEP_RWY,
  ): ILeg {
    const position: IPosition = {
      latitude: runwayInformations.latitude,
      longitude: runwayInformations.longitude,
      elevation: runwayInformations.elevation,
    };
    // If runway has associated with ils dme, application should get ils dme course as magnetic heading!
    return {
      phase: phase,
      type: phase === EFlightPhases.DEP_RWY ? ELegTypes.DR : ELegTypes.AR,
      ident: `RW${runwayInformations.ident}`,
      position: position,
      course: runwayInformations.ils
        ? Number(runwayInformations.ils.locCourse)
        : this.calculateMagneticHeadingDependingOnTrueHeading(
            position,
            runwayInformations.trueHeading,
          ),
      //   TODO: SET DME ON ILS ENTITY THEN HERE
      //   dme: {
      //     ident: runwayInformations.ils.ident,
      //     type: ENavaidTypes;
      // frequency: string;
      // distance: number;
      // course: number;
      //   },
    };
  }

  generateWaypointLeg(
    waypoint: IWaypoint,
    phase: EFlightPhases,
    type?: ELegTypes,
  ): ILeg {
    return {
      phase,
      type: type ? type : ELegTypes.CF,
      ident: waypoint.ident,
      position: {
        latitude: waypoint.latitude,
        longitude: waypoint.longitude,
      },
    };
  }

  generateProcedureLeg(
    terminalLeg: ITerminalLeg,
    phase:
      | EFlightPhases.DEP_PROC
      | EFlightPhases.APP_PROC
      | EFlightPhases.TRS_PROC
      | EFlightPhases.ARR_PROC,
  ): ILeg {
    const altitudeRestrictions = this.getAltitudeRestriction(terminalLeg.alt);
    const ident = altitudeRestrictions.minAlt
      ? `(CLB${altitudeRestrictions.minAlt})`
      : `(DES${altitudeRestrictions.maxAlt})`;
    switch (terminalLeg.trackCode) {
      case ELegTypes.CF:
        return {
          phase: phase,
          type: terminalLeg.trackCode as ELegTypes,
          ident: ident,
          position: {
            latitude: terminalLeg.wptLat,
            longitude: terminalLeg.wptLon,
          },
          procedure: {
            course: terminalLeg.course,
            clbAlt: altitudeRestrictions.minAlt,
            desAlt: altitudeRestrictions.maxAlt,
          },
          restrictions: {
            altitude: altitudeRestrictions,
          },
          lastIntBeforeRunway: true,
        };
      case ELegTypes.CA:
        return {
          phase: phase,
          type: terminalLeg.trackCode as ELegTypes,
          ident: ident,
          procedure: {
            course: terminalLeg.course,
            clbAlt: altitudeRestrictions.minAlt,
            desAlt: altitudeRestrictions.maxAlt,
          },
          restrictions: {
            altitude: altitudeRestrictions,
          },
        };
      case ELegTypes.FD:
        return {
          phase: phase,
          type: terminalLeg.trackCode as ELegTypes,
          ident: ident,
          procedure: {
            course: terminalLeg.course,
            clbAlt: altitudeRestrictions.minAlt,
            desAlt: altitudeRestrictions.maxAlt,
            dmeDistance: terminalLeg.navDist,
          },
          restrictions: {
            altitude: altitudeRestrictions,
          },
          dme: terminalLeg.navID,
        };
      default:
        break;
    }
  }

  generateTerminalLeg(
    terminalLeg: ITerminalLeg,
    phase:
      | EFlightPhases.DEP_PROC
      | EFlightPhases.APP_PROC
      | EFlightPhases.TRS_PROC
      | EFlightPhases.ARR_PROC,
  ): ILeg {
    if (
      (terminalLeg.wptID && terminalLeg.trackCode === ELegTypes.CF) ||
      terminalLeg.trackCode === ELegTypes.IF ||
      terminalLeg.trackCode === ELegTypes.TF // TODO: CHECK TF MEANING IN PROCEDURES
    ) {
      return this.generateWaypointLeg(
        terminalLeg.wptID,
        phase,
        terminalLeg.trackCode,
      );
    } else if (
      (!terminalLeg.wptID && terminalLeg.trackCode === ELegTypes.CF) ||
      terminalLeg.trackCode === ELegTypes.CA ||
      terminalLeg.trackCode === ELegTypes.FD
    ) {
      return this.generateProcedureLeg(terminalLeg, phase);
    }
  }

  getLandingProcedureFromRawLandingData(
    rawLandingData: string,
  ): ELandingTypes | null {
    const splittedLandingData = rawLandingData.split(' ');
    switch (splittedLandingData[1]) {
      case 'ILS':
        return ELandingTypes.ILS;
      case 'VORDME':
        return ELandingTypes.VORDME;

      default:
        return null;
    }
  }

  calculateAndSetDistanceAndCompassDirections() {
    const legs = this.flight.legs;

    for (let index = 0; index < legs.length; index++) {
      const currentLeg = legs[index];
      const nextLeg = legs[index + 1];

      if (currentLeg.position && nextLeg.position) {
        this.flight.legs[index].togo = this.getDistance(
          currentLeg.position,
          nextLeg.position,
        );
      }
    }
  }
}

import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@modules/database/database.service';
import IFlight from './interfaces/Flight';
import SetRouteConfigrationDTO from './dto/SetRouteConfigration.dto';
import InitPositionDTO from './dto/InitPosition.dto';
import SetDepartureConfigrationsDTO from './dto/SetDepartureConfigrations.dto';
import ILeg from './interfaces/Leg';
import ELegType from './enums/LegType';

@Injectable()
export class NavigationService {
  private flight: IFlight;

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

  enRouteConfigration() {}

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
      }
    } else {
      // return origin and position error
    }
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
}

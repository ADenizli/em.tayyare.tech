import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@modules/database/database.service';

@Injectable()
export class NavigationService {
  constructor(private readonly databaseService: DatabaseService) {}

  serviceCheck(): string {
    return '############################\n NAV MODULE LOADED SUCCESSFULLY \n############################';
  }

  // Main Flight Functions
  flightConfigration() {}

  departureConfigration() {}

  enRouteConfigration() {}

  approachConfigration() {}

  compleateFlight() {}

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
}

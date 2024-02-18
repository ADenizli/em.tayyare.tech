import EWayType from '@modules/navigation/enums/way-type.enum';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  serviceCheck(): string {
    return '############################\n DATABASE LOADED SUCCESSFULLY \n############################';
  }

  //   OCC ACTIONS & CRUD

  // GCO ACTIONS
  async GetAirportInformationsByICAO(icao: string) {}
  async GetRunwayInformationsByICAO(icao: string) {}
  async GetDepartureSIDs(icao: string, runway: string) {}
  async GetArrvivalSTARs(icao: string, runway: string) {}
  async GetNavAidByTitle(title: string) {}
  async GetIntersectionByTitle(title: string) {}
  async GetAirwayByTitle(title: string) {}
  //   TODO: FIX HERE
  async GetPointData(point: { type: EWayType; title: string }) {
    switch (point.type) {
      case EWayType.AIRWAY:
        return { error: true, code: 'NM-001' };
      case EWayType.INTERSECTION:
        return await this.GetIntersectionByTitle(point.title);

      case EWayType.NAVAID:
        return await this.GetNavAidByTitle(point.title);

      default:
        return { error: true, code: 'NM-002' };
    }
  }

  // ACO ACTIONS
}

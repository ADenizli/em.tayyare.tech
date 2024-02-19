import { Injectable } from '@nestjs/common';
import IAirport from './interfaces/Airport';
import { FileSystemService } from '@modules/file-system/file-system.service';
import * as path from 'path';
import IORunwaysRaw from './interfaces/ORunways';
import IORunways from './interfaces/ORunways';

@Injectable()
export class DatabaseService {
  private airportsData: IAirport[] = undefined;
  private oRunways: IORunways[];

  constructor(private readonly fileSystemService: FileSystemService) {
    // # on development process, we will get values from navdata folder which is under database module #
    // this.o_airports = this.fileSystemService.readFile('modules/database/navdata/');
    this.oRunways = await this.setOR();
    this.setAirportData();
  }

  // Service Initializement Functions
  async setAirportData(): Promise<any | IAirport[]> {
    const airportRegs = await this.fileSystemService.getFilesInFolder(
      'modules/database/navdata/airports',
    );

    airportRegs.forEach(async (airportReg) => {
      const icao = path.parse(airportReg).name;
      const rawJD = await this.fileSystemService.readFile(airportReg);
      const oAirport = await this.getOAData(icao);
      const oRunwaysByAirport = await this.getRunwaysFromORData(icao);
    });
  }

  async setOR() {
    let OR_Clustered: IORunways[];
    const orRaw = (
      await this.fileSystemService.readFile(
        'modules/database/navdata/runways.csv',
      )
    ).split('\n');
    orRaw.forEach((runway) => {
      const commaSeperatedRunway = runway.split(',');
      OR_Clustered.push({
        id: Number(runway[0]),
        airport_ref: Number(commaSeperatedRunway[1]),
        airport_ident: commaSeperatedRunway[2],
        length_ft: Number(commaSeperatedRunway[3]),
        width_ft: Number(commaSeperatedRunway[4]),
        surface: commaSeperatedRunway[5],
        lighted: Boolean(commaSeperatedRunway[6]),
        closed: Boolean(commaSeperatedRunway[7]),
        le_ident: commaSeperatedRunway[8],
        le_latitude_deg: Number(commaSeperatedRunway[9]),
        le_longitude_deg: Number(commaSeperatedRunway[10]),
        le_elevation_ft: Number(commaSeperatedRunway[11]),
        le_heading_degT: Number(commaSeperatedRunway[12]),
        le_displaced_threshold_ft: Number(commaSeperatedRunway[13]),
        he_ident: commaSeperatedRunway[14],
        he_latitude_deg: Number(commaSeperatedRunway[15]),
        he_longitude_deg: Number(commaSeperatedRunway[16]),
        he_elevation_ft: Number(commaSeperatedRunway[17]),
        he_heading_degT: Number(commaSeperatedRunway[18]),
        he_displaced_threshold_ft: Number(commaSeperatedRunway[19]),
      });
    });
    return OR_Clustered;
  }

  async getOAData(icao: string) {}

  getRunwaysFromORData(icao: string) {
    return this.oRunways.filter((oRunway) => oRunway.airport_ident === icao);
  }

  serviceCheck(): string {
    return '############################\n DATABASE LOADED SUCCESSFULLY \n############################';
  }

  //   OCC ACTIONS & CRUD

  // GCO ACTIONS
  // async GetAirportInformationsByICAO(icao: string) {}
  // async GetRunwayInformationsByICAO(icao: string) {}
  // async GetDepartureSIDs(icao: string, runway: string) {}
  // async GetArrvivalSTARs(icao: string, runway: string) {}
  // async GetNavAidByTitle(title: string) {}
  // async GetIntersectionByTitle(title: string) {}
  // async GetAirwayByTitle(title: string) {}
  // //   TODO: FIX HERE
  // async GetPointData(point: { type: EWayType; title: string }) {
  //   switch (point.type) {
  //     case EWayType.AIRWAY:
  //       return { error: true, code: 'NM-001' };
  //     case EWayType.INTERSECTION:
  //       return await this.GetIntersectionByTitle(point.title);

  //     case EWayType.NAVAID:
  //       return await this.GetNavAidByTitle(point.title);

  //     default:
  //       return { error: true, code: 'NM-002' };
  //   }
  // }

  // ACO ACTIONS
}

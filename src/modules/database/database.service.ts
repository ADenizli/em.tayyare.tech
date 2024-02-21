import { Injectable } from '@nestjs/common';
import IAirport, { IGate, IRunway } from './interfaces/Airport';
import { FileSystemService } from '@modules/file-system/file-system.service';
import * as path from 'path';
import IORunway from './interfaces/ORunway';
import IOAirport from './interfaces/OAirport';
import IOCountry from './interfaces/OCountry';
import IORegion from './interfaces/ORegion';
import parseCoordinate from '@modules/common/helpers/ParseCoordinate';
import IFix from './interfaces/Fix';

@Injectable()
export class DatabaseService {
  private airports: IAirport[] = [];
  private fixes: IFix[] = [];
  private errorsOnAirports: string[] = [];
  private oRunways: IORunway[];
  private oAirports: IOAirport[];
  private oCountries: IOCountry[];
  private oRegions: IORegion[];

  constructor(private readonly fileSystemService: FileSystemService) {
    // # on development process, we will get values from navdata folder which is under database module #
    this.serviceInitializement()
      .then(() => {
        console.log('Database has initialized!');
      })
      .catch((error) => {
        console.error('Error during database initialization:', error);
      });
  }

  // Service Initializement Functions
  async serviceInitializement() {
    this.oRegions = await this.setORegions();
    this.oCountries = await this.setOCountries();
    this.oRunways = await this.setORunways();
    this.oAirports = await this.setOAirports();
    this.setAirportData();
    this.setFixes();
  }
  async setAirportData(): Promise<any | IAirport[]> {
    const airportRegs = await this.fileSystemService.getFilesInFolder(
      'modules/database/navdata/airports',
    );

    airportRegs.forEach(async (airportReg) => {
      const icao = path.parse(airportReg).name;
      const rawJD = (await this.fileSystemService.readFile(airportReg)).split(
        '\n',
      );
      const oAirport = this.getAirportOAData(icao);
      const oRunwaysByAirport = this.getRunwaysFromORData(icao);
      const countryData =
        oAirport && this.getCountryOCData(oAirport.iso_country);
      const regionData = oAirport && this.getRegionORData(oAirport.iso_region);

      if (oAirport && oRunwaysByAirport && countryData && regionData) {
        const gates: IGate[] = [];
        const runways: IRunway[] = [];

        rawJD.forEach((line) => {
          if (line.startsWith('GATE') && !line.startsWith('GATES')) {
            const parts = line.split(' ');
            const ident = parts[1];
            const latitude = parseCoordinate(parts[2], parts[3], parts[4]);
            const longitude = parseCoordinate(parts[5], parts[6], parts[7]);
            gates.push({ ident, position: { latitude, longitude } });
          } else if (line.startsWith('RNW') && !line.startsWith('RNWS')) {
            const parts = line.split(' ');
            const ident = parts[1];
            const oRunway = oRunwaysByAirport.find(
              (runway) =>
                runway.le_ident === ident || runway.he_ident === ident,
            );
            if (oRunway) {
              const hl = oRunway.le_ident === ident ? 'le' : 'he';
              runways.push({
                ident,
                position: {
                  latitude: oRunway[`${hl}_latitude_deg`],
                  longitude: oRunway[`${hl}_longitude_deg`],
                  elevation: oRunway[`${hl}_elevation_feet`],
                },
                course: oRunway[`${hl}_heading_degT`],
                is_closed: oRunway.closed,
              });
            }
          }
        });
        this.airports.push({
          icao: oAirport.ident,
          iata: oAirport.iata_code,
          name: oAirport.name,
          position: {
            latitude: oAirport.latitude_deg,
            longitude: oAirport.longitude_deg,
            elevation: oAirport.elevation_ft,
          },
          iso_country: {
            iso: oAirport.iso_country,
            name: countryData.name,
            continent: countryData.continent,
          },
          iso_region: {
            iso: oAirport.iso_region,
            city: regionData.city,
          },
          gates,
          runways,
        });
      } else {
        this.errorsOnAirports.push(icao);
      }
    });
  }

  async setORunways() {
    const OR_Clustered: IORunway[] = [];
    const orRaw = (
      await this.fileSystemService.readFile(
        'modules/database/navdata/runways.csv',
      )
    ).split('\n');
    orRaw.forEach((runway, index) => {
      if (index !== 0) {
        const commaSeperatedRunway = runway.split(',');
        OR_Clustered.push({
          id: Number(commaSeperatedRunway[0]),
          airport_ref: Number(commaSeperatedRunway[1]),
          airport_ident: commaSeperatedRunway[2].replace(/"/g, ''),
          length_ft: Number(commaSeperatedRunway[3]),
          width_ft: Number(commaSeperatedRunway[4]),
          surface: commaSeperatedRunway[5].replace(/"/g, ''),
          lighted: Boolean(commaSeperatedRunway[6]),
          closed: Boolean(commaSeperatedRunway[7]),
          le_ident: commaSeperatedRunway[8].replace(/"/g, ''),
          le_latitude_deg: Number(commaSeperatedRunway[9]),
          le_longitude_deg: Number(commaSeperatedRunway[10]),
          le_elevation_ft: Number(commaSeperatedRunway[11]),
          le_heading_degT: Number(commaSeperatedRunway[12]),
          le_displaced_threshold_ft: Number(commaSeperatedRunway[13]),
          he_ident: commaSeperatedRunway[14].replace(/"/g, ''),
          he_latitude_deg: Number(commaSeperatedRunway[15]),
          he_longitude_deg: Number(commaSeperatedRunway[16]),
          he_elevation_ft: Number(commaSeperatedRunway[17]),
          he_heading_degT: Number(commaSeperatedRunway[18]),
          he_displaced_threshold_ft: Number(commaSeperatedRunway[19]),
        });
      }
    });
    return OR_Clustered;
  }

  async setOAirports() {
    const OA_Clustered: IOAirport[] = [];
    const oaRaw = (
      await this.fileSystemService.readFile(
        'modules/database/navdata/airports.csv',
      )
    ).split('\n');
    oaRaw.forEach((oairport, index) => {
      if (index !== 0) {
        const commaSeperatedAirport = oairport.split(',');
        OA_Clustered.push({
          id: Number(commaSeperatedAirport[0]),
          ident: commaSeperatedAirport[1].replace(/"/g, ''),
          type: commaSeperatedAirport[2].replace(/"/g, ''),
          name: commaSeperatedAirport[3].replace(/"/g, ''),
          latitude_deg: Number(commaSeperatedAirport[4]),
          longitude_deg: Number(commaSeperatedAirport[5]),
          elevation_ft: Number(commaSeperatedAirport[6]),
          continent: commaSeperatedAirport[7].replace(/"/g, ''),
          iso_country: commaSeperatedAirport[8].replace(/"/g, ''),
          iso_region: commaSeperatedAirport[9].replace(/"/g, ''),
          municipality: commaSeperatedAirport[10].replace(/"/g, ''),
          scheduled_service: commaSeperatedAirport[11].replace(/"/g, ''),
          gps_code: commaSeperatedAirport[12].replace(/"/g, ''),
          iata_code: commaSeperatedAirport[13].replace(/"/g, ''),
          local_code: commaSeperatedAirport[14].replace(/"/g, ''),
        });
      }
    });
    return OA_Clustered;
  }

  async setOCountries() {
    const OC_Clustered: IOCountry[] = [];
    const ocRaw = (
      await this.fileSystemService.readFile(
        'modules/database/navdata/countries.csv',
      )
    ).split('\n');
    ocRaw.forEach((country, index) => {
      if (index !== 0) {
        const commaSeperatedCountry = country.split(',');
        OC_Clustered.push({
          iso: commaSeperatedCountry[1].replace(/"/g, ''),
          name: commaSeperatedCountry[2].replace(/"/g, ''),
          continent: commaSeperatedCountry[3].replace(/"/g, ''),
        });
      }
    });
    return OC_Clustered;
  }

  async setORegions() {
    const OR_Clustered: IORegion[] = [];
    const orRaw = (
      await this.fileSystemService.readFile(
        'modules/database/navdata/regions.csv',
      )
    ).split('\n');
    orRaw.forEach((region, index) => {
      if (index !== 0) {
        const commaSeperatedRegion = region.split(',');
        OR_Clustered.push({
          iso: commaSeperatedRegion[1].replace(/"/g, ''),
          city: commaSeperatedRegion[3].replace(/"/g, ''),
          continent: commaSeperatedRegion[4].replace(/"/g, ''),
        });
      }
    });
    return OR_Clustered;
  }

  getRunwaysFromORData(icao: string): IORunway[] {
    return this.oRunways.filter((oRunway) => oRunway.airport_ident === icao);
  }

  getAirportOAData(icao: string): IOAirport {
    return this.oAirports.find((oAirport) => oAirport.ident === icao);
  }

  getRegionORData(iso: string): IORegion {
    return this.oRegions.find((oRegion) => oRegion.iso === iso);
  }

  getCountryOCData(iso: string): IOCountry {
    return this.oCountries.find((oCountry) => oCountry.iso === iso);
  }

  async setFixes() {
    const fixesRaw = (
      await this.fileSystemService.readFile(
        'modules/database/navdata/fixes.txt',
      )
    ).split('\n');

    fixesRaw.forEach((line) => {
      if (!line.startsWith(';')) {
        const blankArray = line.split(' ');
        if (blankArray.length > 1) {
          let fix: IFix;
          if (blankArray[0].length === 4) {
            console.log(blankArray);

            fix = {
              ident: blankArray[0],
              position: {
                latitude: Number(blankArray[28]),
                longitude: Number(blankArray[29]),
              },
            };
          } else if (blankArray[0].length === 3) {
            fix = {
              ident: blankArray[0],
              position: {
                latitude: Number(blankArray[30]),
                longitude: Number(blankArray[32]),
              },
            };
          } else {
            fix = {
              ident: blankArray[19],
              position: {
                latitude: Number(blankArray[26]),
                longitude: Number(blankArray[27]),
              },
            };
          }
          this.fixes.push(fix);
        }
      }
    });
    console.log(this.fixes);
  }

  serviceCheck(): string {
    return '############################\n DATABASE LOADED SUCCESSFULLY \n############################';
  }

  checkErrorsOnAirports(): boolean {
    console.log(this.errorsOnAirports);
    return true;
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

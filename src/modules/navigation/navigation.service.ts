// import { Injectable } from '@nestjs/common';
// import { DatabaseService } from '@modules/database/database.service';
// import DefineRoughRouteDTO from './dto/define-rough-route.dto';
// import EWayType from './enums/way-type.enum';

// @Injectable()
// export class NavigationService {
//   constructor(private readonly databaseService: DatabaseService) {}

//   serviceCheck(): string {
//     return '############################\n NAV MODULE LOADED SUCCESSFULLY \n############################';
//   }

//   //   OCC ACTIONS & CRUD

//   // GCO ACTIONS
//   async DefineRoughRoute(DefineRoughRouteDto: DefineRoughRouteDTO) {
//     // Get Airport Informations
//     const departureAirport =
//       await this.databaseService.GetAirportInformationsByICAO(
//         DefineRoughRouteDto.departure_airport,
//       );
//     const arrvivalAirport =
//       await this.databaseService.GetAirportInformationsByICAO(
//         DefineRoughRouteDto.arrvival_airport,
//       );

//     // Create Route Schema
//     const ways = DefineRoughRouteDto.route;

//     const RoughRoute = [
//       {
//         type: 'ORIGIN',
//         val: departureAirport,
//       },
//       ways.map((way, index) => {
//         if (index === 0) {
//           return {
//             type: 'INITIAL_WAYPOINT',
//             val: way,
//           };
//         } else if (way.type === EWayType.AIRWAY) {
//           // Get Airway
//           let airway = await this.databaseService.GetAirwayByTitle(way.title);

//           const nextIntersection = this.databaseService.GetPointData(
//             ways[index + 1],
//           );
//           const prevIntersection = this.databaseService.GetPointData(
//             ways[index - 1],
//           );

//           const startIndex = airway.findIndex(
//             (point) => point.title === prevIntersection.title,
//           );
//           const endIndex = airway.findIndex(
//             (point) => point.title === nextIntersection.title,
//           );

//           const neededAirway = airway.slice(startIndex, endIndex - 1);

//           return neededAirway.map((point) => point);
//         }
//       }),
//       {},
//     ];
//   }

//   // ACO ACTIONS
// }

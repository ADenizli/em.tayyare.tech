import { Controller, Get, Param } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  controllerCheck(): string {
    return this.databaseService.serviceCheck();
  }

  @Get('airports/:icao')
  getAirportData(@Param('icao') icao: string): any {
    return this.databaseService.getAirport(icao);
  }

  // @Get('errorsOnAirports')
  // checkErrorsOnAirports(): boolean {
  //   return this.databaseService.checkErrorsOnAirports();
  // }
}

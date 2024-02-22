import { Controller, Get, Param } from '@nestjs/common';
import { DatabaseService } from './database.service';
import IAirport from './interfaces/Airport';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  controllerCheck(): string {
    return this.databaseService.serviceCheck();
  }

  @Get('airports/:icao')
  getAirportData(@Param('icao') icao: string): IAirport {
    return this.databaseService.getAirportData(icao);
  }

  @Get('errorsOnAirports')
  checkErrorsOnAirports(): boolean {
    return this.databaseService.checkErrorsOnAirports();
  }
}

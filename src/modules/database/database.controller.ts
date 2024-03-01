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

  @Get('airports/:icao/terminal-procedures')
  getTerminalProcedures(@Param('icao') icao: string): any {
    return this.databaseService.getSIDs(icao);
  }

  @Get('airports/:icao/terminal-procedures/:id')
  getTerminalProcedure(@Param('id') id: string): any {
    return this.databaseService.getFixesOfTerminalProcedure(Number(id));
  }

  // @Get('errorsOnAirports')
  // checkErrorsOnAirports(): boolean {
  //   return this.databaseService.checkErrorsOnAirports();
  // }
}

import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  controllerCheck(): string {
    return this.databaseService.serviceCheck();
  }

  @Get('errorsOnAirports')
  checkErrorsOnAirports(): boolean {
    return this.databaseService.checkErrorsOnAirports();
  }
}

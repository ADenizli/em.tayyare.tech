import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller()
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  controllerCheck(): string {
    return this.databaseService.serviceCheck();
  }
}

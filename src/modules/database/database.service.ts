import { Injectable } from '@nestjs/common';
import { AirportEntity } from './entities/airport.entity';
import { EntityRepository } from '@mikro-orm/sqlite';
import { InjectRepository } from '@mikro-orm/nestjs';
import { RunwayEntity } from './entities/runway.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(AirportEntity)
    private readonly airportRepository: EntityRepository<AirportEntity>,
    @InjectRepository(RunwayEntity)
    private readonly runwayRepository: EntityRepository<RunwayEntity>,
  ) {}

  serviceCheck(): string {
    return '############################\n DATABASE LOADED SUCCESSFULLY \n############################';
  }

  async getAirport(icao: string) {
    const airport = await this.airportRepository.findOne(
      { icao },
      { populate: ['runways'] },
    );
    return airport;
  }
}

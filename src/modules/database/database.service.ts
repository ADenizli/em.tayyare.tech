import { Injectable } from '@nestjs/common';
import { AirportEntity } from './entities/airport.entity';
import { EntityRepository } from '@mikro-orm/sqlite';
import { InjectRepository } from '@mikro-orm/nestjs';
import { RunwayEntity } from './entities/runway.entity';
import { TerminalProceduresEntity } from './entities/terminalProcedures.entity';
import { TerminalLegEntity } from './entities/terminalProcedureLegs.entity';
import ITerminalProcedure from './interfaces/TerminalProcedure';
@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(AirportEntity)
    private readonly airportRepository: EntityRepository<AirportEntity>,
    @InjectRepository(RunwayEntity)
    private readonly runwayRepository: EntityRepository<RunwayEntity>,
    @InjectRepository(TerminalProceduresEntity)
    private readonly terminalProceduresRepository: EntityRepository<TerminalProceduresEntity>,
    @InjectRepository(TerminalLegEntity)
    private readonly terminalProcedureLegsRepository: EntityRepository<TerminalLegEntity>,
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

  // Terminal Procedures Table
  // Reading
  async getSIDs(icao: string): Promise<ITerminalProcedure[]> {
    return await this.terminalProceduresRepository.find(
      { icao, proc: '2' },
      { populate: ['ilsID', 'airportID'] },
    );
  }

  async getSTARs(icao: string): Promise<ITerminalProcedure[]> {
    return await this.terminalProceduresRepository.find(
      { icao, proc: '1' },
      { populate: ['ilsID', 'airportID'] },
    );
  }

  async getAPPs(icao: string): Promise<ITerminalProcedure[]> {
    return await this.terminalProceduresRepository.find(
      { icao, proc: '1' },
      { populate: ['ilsID', 'airportID'] },
    );
  }

  async getTerminalProcedureByID(id: number): Promise<ITerminalProcedure[]> {
    return await this.terminalProceduresRepository.find(
      { id },
      { populate: ['ilsID', 'airportID'] },
    );
  }

  // Terminal Procedures Fixes Table
  // Reading

  // TODO: Fix Any
  async getFixesOfTerminalProcedure(id: number): Promise<any[]> {
    return await this.terminalProcedureLegsRepository.find(
      { terminalID: id },
      { populate: ['terminalID', 'wptID', 'navID', 'centerID'] },
    );
  }
}

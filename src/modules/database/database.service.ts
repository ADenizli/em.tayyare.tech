import { Injectable } from '@nestjs/common';
import { AirportEntity } from './entities/airport.entity';
import { EntityRepository } from '@mikro-orm/sqlite';
import { InjectRepository } from '@mikro-orm/nestjs';
import { RunwayEntity } from './entities/runway.entity';
import { TerminalProcedureEntity } from './entities/terminalProcedure.entity';
import { TerminalLegEntity } from './entities/terminalLeg.entity';
import ITerminalProcedure, {
  ITerminalLeg,
} from './interfaces/TerminalProcedure';
import { TerminalLegRepository } from './repositories/terminalLeg.repo';
import { TerminalProcedureRepository } from './repositories/terminalProcedure.repo';
import { WaypointEntity } from './entities/waypoint.entity';
import { WaypointRepository } from './repositories/waypoint.repo';
import IWaypoint from './interfaces/Point';
import { AirwayEntity } from './entities/airway.entity';
import { AirwayRepository } from './repositories/airway.repo';
import IAirway from './interfaces/Airway';
@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(AirportEntity)
    private readonly airportRepository: EntityRepository<AirportEntity>,
    @InjectRepository(RunwayEntity)
    private readonly runwayRepository: EntityRepository<RunwayEntity>,
    @InjectRepository(TerminalProcedureEntity)
    private readonly terminalProcedureRepository: TerminalProcedureRepository,
    @InjectRepository(TerminalLegEntity)
    private readonly terminalLegsRepository: TerminalLegRepository,
    @InjectRepository(WaypointEntity)
    private readonly waypointEntity: WaypointRepository,
    @InjectRepository(AirwayEntity)
    private readonly airwayEntity: AirwayRepository,
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
    return await this.terminalProcedureRepository.find(
      { icao, proc: '2' },
      { populate: ['ilsID', 'airportID'] },
    );
  }

  async getSIDByID(id: number): Promise<ITerminalProcedure> {
    return await this.terminalProcedureRepository.getTerminalProcedureByID(id);
  }

  async getSTARs(icao: string): Promise<ITerminalProcedure[]> {
    return await this.terminalProcedureRepository.find(
      { icao, proc: '1' },
      { populate: ['ilsID', 'airportID'] },
    );
  }

  async getAPPs(icao: string): Promise<ITerminalProcedure[]> {
    return await this.terminalProcedureRepository.find(
      { icao, proc: '1' },
      { populate: ['ilsID', 'airportID'] },
    );
  }

  async getTerminalProcedureByID(id: number): Promise<ITerminalProcedure[]> {
    return await this.terminalProcedureRepository.find(
      { id },
      { populate: ['ilsID', 'airportID'] },
    );
  }

  // Terminal Procedures Fixes Table
  // Reading

  async getLegsOfTerminalProcedure(
    terminalID: number,
  ): Promise<ITerminalLeg[]> {
    return await this.terminalLegsRepository.getTerminalLegs(terminalID);
  }

  // Waypoints Table
  //Reading
  async getWPTByIdent(ident: string): Promise<IWaypoint[]> {
    return await this.waypointEntity.getWaypointByIdent(ident);
  }

  // Airways Table
  // Reading
  async getAirwayWaypoints(ident: string): Promise<IAirway> {
    return await this.airwayEntity.getAirwayWithWaypoints(ident);
  }
}

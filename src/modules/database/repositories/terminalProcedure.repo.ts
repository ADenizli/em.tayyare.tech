import { EntityRepository } from '@mikro-orm/sqlite';
import { TerminalProcedureEntity } from '../entities/terminalProcedure.entity';
import ITerminalProcedure from '../interfaces/TerminalProcedure';

export class TerminalProcedureRepository extends EntityRepository<TerminalProcedureEntity> {
  // custom methods...
  async getTerminalProcedureByID(id: number): Promise<ITerminalProcedure> {
    return this.findOne({ id });
  }
}

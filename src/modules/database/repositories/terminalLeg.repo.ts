import { EntityRepository } from '@mikro-orm/sqlite';
import { ITerminalLeg } from '../interfaces/TerminalProcedure';
import { TerminalLegEntity } from '../entities/terminalLeg.entity';

export class TerminalLegRepository extends EntityRepository<TerminalLegEntity> {
  // custom methods...
  public async getTerminalLegs(terminalID: number): Promise<ITerminalLeg[]> {
    const response: ITerminalLeg[] = [];
    const legs = await this.find(
      { terminalID },
      { populate: ['terminalID', 'wptID', 'navID', 'speedLimit'] },
    );
    legs.forEach((leg: TerminalLegEntity) => {
      console.log(leg.speedLimit);
      response.push({
        id: leg.id,
        terminalID: leg.terminalID.id,
        type: leg.type,
        transition: leg.transition,
        trackCode: leg.trackCode,
        wptID: leg.wptID !== null && {
          id: leg.wptID.id,
          ident: leg.wptID.ident,
          collocated: leg.wptID.collocated,
          name: leg.wptID.name,
          latitude: leg.wptID.latitude,
          longitude: leg.wptID.longitude,
          navaidID: leg.wptID.navaidID,
        },
        wptLat: leg.wptLat,
        wptLon: leg.wptLon,
        turnDir: leg.turnDir,
        navID: leg.navID !== null && {
          id: leg.navID.id,
          ident: leg.navID.ident,
          type: leg.navID.type,
          name: leg.navID.name,
          freq: leg.navID.freq,
          channel: leg.navID.channel,
          usage: leg.navID.usage,
          latitude: leg.navID.latitude,
          longitude: leg.navID.longitude,
          elevation: leg.navID.elevation,
          slavedVar: leg.navID.slavedVar,
          magneticVariation: leg.navID.magneticVariation,
          range: leg.navID.range,
        },
        navLat: leg.navLat,
        navLon: leg.navLon,
        navBear: leg.navBear,
        navDist: leg.navDist,
        course: leg.course,
        distance: leg.distance,
        alt: leg.alt,
        vnav: leg.vnav,
        centerID: leg.centerID !== null && {
          id: leg.centerID.id,
          ident: leg.centerID.ident,
          collocated: leg.centerID.collocated,
          name: leg.centerID.name,
          latitude: leg.centerID.latitude,
          longitude: leg.centerID.longitude,
          navaidID: leg.centerID.navaidID,
        },
        centerLat: leg.centerLat,
        centerLon: leg.centerLon,
        wptDescCode: leg.wptDescCode,
        speedLimit: leg.speedLimit !== undefined && {
          id: leg.speedLimit.id,
          isFlyOver: leg.speedLimit.isFlyOver,
          speedLimit: leg.speedLimit.speedLimit,
          speedLimitDescription: leg.speedLimit.speedLimitDescription,
        },
      });
    });

    return response;
  }
}

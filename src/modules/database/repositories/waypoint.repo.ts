import { EntityRepository } from '@mikro-orm/sqlite';
import IWaypoint from '../interfaces/Point';
import { WaypointEntity } from '../entities/waypoint.entity';

export class WaypointRepository extends EntityRepository<WaypointEntity> {
  // custom methods...getWaypointByID
  async getWaypointByIdent(ident: string): Promise<IWaypoint[]> {
    const waypoints = await this.find({ ident }, { populate: ['navaidID'] });

    return waypoints.map((waypoint) => ({
      id: waypoint.id,
      ident: waypoint.ident,
      collocated: waypoint.collocated,
      name: waypoint.name,
      latitude: waypoint.latitude,
      longitude: waypoint.longitude,
      navaidID: waypoint.navaidID
        ? {
            id: waypoint.navaidID.id,
            ident: waypoint.navaidID.ident,
            type: waypoint.navaidID.type,
            name: waypoint.navaidID.name,

            freq: waypoint.navaidID.freq,
            channel: waypoint.navaidID.channel,
            usage: waypoint.navaidID.usage,
            latitude: waypoint.navaidID.latitude,
            longitude: waypoint.navaidID.longitude,
            elevation: waypoint.navaidID.elevation,
            slavedVar: waypoint.navaidID.slavedVar,
            magneticVariation: waypoint.navaidID.magneticVariation,
            range: waypoint.navaidID.range,
          }
        : null,
    }));
  }

  async getWaypointByID(id: number): Promise<IWaypoint> {
    const waypoint = await this.findOne({ id }, { populate: ['navaidID'] });

    if (!waypoint) {
      return undefined;
    }

    return {
      id: waypoint.id,
      ident: waypoint.ident,
      collocated: waypoint.collocated,
      name: waypoint.name,
      latitude: waypoint.latitude,
      longitude: waypoint.longitude,
      navaidID: waypoint.navaidID
        ? {
            id: waypoint.navaidID.id,
            ident: waypoint.navaidID.ident,
            type: waypoint.navaidID.type,
            name: waypoint.navaidID.name,

            freq: waypoint.navaidID.freq,
            channel: waypoint.navaidID.channel,
            usage: waypoint.navaidID.usage,
            latitude: waypoint.navaidID.latitude,
            longitude: waypoint.navaidID.longitude,
            elevation: waypoint.navaidID.elevation,
            slavedVar: waypoint.navaidID.slavedVar,
            magneticVariation: waypoint.navaidID.magneticVariation,
            range: waypoint.navaidID.range,
          }
        : null,
    };
  }
}

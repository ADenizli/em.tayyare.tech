import { EntityRepository } from '@mikro-orm/sqlite';
import { AirwayEntity } from '../entities/airway.entity';
import { AirwayLegEntity } from '../entities/airwayLeg.entity';
import IAirway from '../interfaces/Airway';
import IWaypoint from '../interfaces/Point';

export class AirwayRepository extends EntityRepository<AirwayEntity> {
  // custom methods...
  async getAirwayWithWaypoints(ident: string): Promise<IAirway> {
    const airway = await this.findOne(
      { ident },
      { populate: ['legs', 'legs.from', 'legs.to'] },
    );
    const airwayLegs: IWaypoint[] = [];

    airway.legs.getItems().forEach((leg: AirwayLegEntity) => {
      airwayLegs.push({
        id: leg.from.id,
        ident: leg.from.ident,
        collocated: leg.from.collocated,
        name: leg.from.name,
        latitude: leg.from.latitude,
        longitude: leg.from.longitude,
        navaidID: leg.from.navaidID
          ? {
              id: leg.from.navaidID.id,
              ident: leg.from.navaidID.ident,
              type: leg.from.navaidID.type,
              name: leg.from.navaidID.name,

              freq: leg.from.navaidID.freq,
              channel: leg.from.navaidID.channel,
              usage: leg.from.navaidID.usage,
              latitude: leg.from.navaidID.latitude,
              longitude: leg.from.navaidID.longitude,
              elevation: leg.from.navaidID.elevation,
              slavedVar: leg.from.navaidID.slavedVar,
              magneticVariation: leg.from.navaidID.magneticVariation,
              range: leg.from.navaidID.range,
            }
          : null,
      });
      if (leg.isEnd) {
        airwayLegs.push({
          id: leg.to.id,
          ident: leg.to.ident,
          collocated: leg.to.collocated,
          name: leg.to.name,
          latitude: leg.to.latitude,
          longitude: leg.to.longitude,
          navaidID: leg.to.navaidID
            ? {
                id: leg.to.navaidID.id,
                ident: leg.to.navaidID.ident,
                type: leg.to.navaidID.type,
                name: leg.to.navaidID.name,

                freq: leg.to.navaidID.freq,
                channel: leg.to.navaidID.channel,
                usage: leg.to.navaidID.usage,
                latitude: leg.to.navaidID.latitude,
                longitude: leg.to.navaidID.longitude,
                elevation: leg.to.navaidID.elevation,
                slavedVar: leg.to.navaidID.slavedVar,
                magneticVariation: leg.to.navaidID.magneticVariation,
                range: leg.to.navaidID.range,
              }
            : null,
        });
      }
    });
    return {
      id: airway.id,
      ident: airway.ident,
      legs: airwayLegs,
    };
  }
}

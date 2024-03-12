import { EntityRepository } from '@mikro-orm/sqlite';
import { AirwayEntity } from '../entities/airway.entity';
import { AirwayLegEntity } from '../entities/airwayLeg.entity';
import IAirway from '../interfaces/Airway';
import IWaypoint from '../interfaces/Point';
import { WaypointEntity } from '../entities/waypoint.entity';

export class AirwayRepository extends EntityRepository<AirwayEntity> {
  // custom methods...
  // Holding at airways for 2 days
  async getAirwayWithWaypoints(id: number): Promise<IAirway> {
    const airway = await this.findOne(
      { id },
      { populate: ['legs', 'legs.from', 'legs.to'] },
    );
    const airwayRawLegs = airway.legs.getItems();
    const airwayLegs: IWaypoint[] = [];
    // let isEndPoint = false;
    const startPoint = airwayRawLegs.find(
      (leg: AirwayLegEntity) => leg.isStart === true,
    );

    let activePoint = startPoint;
    const pushedPoints: number[] = [];

    for (let index = 0; index < airwayRawLegs.length; index++) {
      this.airwayLegPush(airwayLegs, activePoint.from);
      pushedPoints.push(activePoint.from.id);
      if (activePoint.isEnd === true) {
        this.airwayLegPush(airwayLegs, activePoint.to);
        // isEndPoint = true;
        break;
      } else {
        activePoint = airwayRawLegs.find(
          (leg: AirwayLegEntity) =>
            leg.from.id === activePoint.to.id &&
            !pushedPoints.includes(leg.to.id),
        );
        if (!activePoint) {
          console.error('Next leg not found');
          break; // Exit the loop if the next leg is not found
        }
        // console.log(activePoint);
      }
    }

    return {
      id: airway.id,
      ident: airway.ident,
      legs: airwayLegs,
    };
  }

  private readonly airwayLegPush = (
    airwayLegs: IWaypoint[],
    leg: WaypointEntity,
  ) => {
    airwayLegs.push({
      id: leg.id,
      ident: leg.ident,
      collocated: leg.collocated,
      name: leg.name,
      latitude: leg.latitude,
      longitude: leg.longitude,
      navaidID: leg.navaidID
        ? {
            id: leg.navaidID.id,
            ident: leg.navaidID.ident,
            type: leg.navaidID.type,
            name: leg.navaidID.name,
            freq: leg.navaidID.freq,
            channel: leg.navaidID.channel,
            usage: leg.navaidID.usage,
            latitude: leg.navaidID.latitude,
            longitude: leg.navaidID.longitude,
            elevation: leg.navaidID.elevation,
            slavedVar: leg.navaidID.slavedVar,
            magneticVariation: leg.navaidID.magneticVariation,
            range: leg.navaidID.range,
          }
        : null,
    });
  };
}

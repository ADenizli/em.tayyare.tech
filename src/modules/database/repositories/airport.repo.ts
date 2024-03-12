import { EntityRepository } from '@mikro-orm/sqlite';
import { AirportEntity } from '../entities/airport.entity';
import IAirport from '../interfaces/Airport';

export class AirportRepository extends EntityRepository<AirportEntity> {
  // custom methods...
  async getAirportByICAO(icao: string): Promise<IAirport> {
    const airport = await this.findOne(
      { icao },
      { populate: ['runways', 'runways.ils'] },
    );

    return {
      id: airport.id,
      name: airport.name,
      icao: airport.icao,
      latitude: airport.latitude,
      longitude: airport.longitude,
      elevation: airport.elevation,
      transitionAltitude: airport.transitionAltitude,
      transitionLevel: airport.transitionLevel,
      runways: airport.runways.map((runway) => ({
        id: runway.id,
        airportID: runway.airportID.id,
        ident: runway.ident,
        trueHeading: runway.trueHeading,
        length: runway.length,
        width: runway.width,
        //   surface?: runway.surface, TODO: make it after doing surface entity connection
        latitude: runway.latitude,
        longitude: runway.longitude,
        elevation: runway.elevation,
        ils: {
          id: runway.ils.id,
          ident: runway.ils.ident,
          frequency: runway.ils.freq,
          gsAngle: runway.ils.gsAngle,
          category: runway.ils.category,
          locCourse: runway.ils.locCourse,
          crossingHeight: runway.ils.crossingHeight,
          hasDme: runway.ils.hasDme,
          position: {
            latitude: runway.ils.latitude,
            longitude: runway.ils.longitude,
            elevation: runway.ils.elevation,
          },
        },
      })),
    };
  }
}

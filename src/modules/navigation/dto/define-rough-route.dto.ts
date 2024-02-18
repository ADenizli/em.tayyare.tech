import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import IWay from '../interfaces/way.interface';

export default class DefineRoughRouteDTO {
  @IsNotEmpty()
  @IsString()
  departure_airport: string;

  @IsNotEmpty()
  @IsArray()
  route: IWay[];

  @IsNotEmpty()
  @IsString()
  arrvival_airport: string;
}

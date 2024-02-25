import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import EDepartureConfigrations from '../enums/DepartureConfigrations';

export default class SetDepartureConfigrationsDTO {
  @IsNotEmpty()
  type: EDepartureConfigrations;

  @IsNotEmpty()
  @IsString()
  runway: string;

  @IsOptional()
  @IsString()
  sid: string;
}

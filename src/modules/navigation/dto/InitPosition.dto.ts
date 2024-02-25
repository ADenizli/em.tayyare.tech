import IPosition from '@modules/common/interfaces/Position';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export default class InitPositionDTO {
  @IsString()
  @IsNotEmpty()
  origin: string;
  @IsString()
  @IsOptional()
  gate: string;
  @IsObject()
  @IsNotEmpty()
  position: IPosition;
}

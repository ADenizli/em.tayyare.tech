import { IsOptional, IsString } from 'class-validator';

export default class SetRouteConfigrationDTO {
  @IsString()
  @IsOptional()
  destination: string;
}

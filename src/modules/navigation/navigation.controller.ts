import { Body, Controller, Get, Patch } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import InitPositionDTO from './dto/InitPosition.dto';
import FMS_Response from '@modules/common/interfaces/FMSResponse';
import SendResponse from '@modules/common/helpers/SendResponse';

@Controller('navigation')
export class NavigationController {
  constructor(private readonly navigationService: NavigationService) {}

  @Get()
  controllerCheck(): string {
    return this.navigationService.serviceCheck();
  }

  @Get('create-flight-legs-test')
  createFlightLegsTest(): Promise<void> {
    return this.navigationService.createFlightLegs();
  }

  @Get('get-flight')
  getFlight(): void {
    this.getFlight();
  }

  @Patch('init-position')
  InitPosition(@Body() dto: InitPositionDTO): FMS_Response {
    this.navigationService.initPosition(dto);
    return SendResponse('init-position-successfull');
  }
}

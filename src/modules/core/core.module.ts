import { Module } from '@nestjs/common';
import { AppController } from './core.controller';
import { AppService } from './core.service';
import { DatabaseModule } from '@modules/database/database.module';
import { NavigationModule } from '@modules/navigation/navigation.module';

@Module({
  imports: [DatabaseModule, NavigationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { NavigationController } from './navigation.controller';
import { DatabaseModule } from '@modules/database/database.module';
import { DatabaseService } from '@modules/database/database.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import DatabaseModuleEntities from '@modules/database/entities';

@Module({
  imports: [
    DatabaseModule,
    MikroOrmModule.forFeature({
      entities: [...DatabaseModuleEntities],
    }),
  ],
  controllers: [NavigationController],
  providers: [DatabaseService, NavigationService],
})
export class NavigationModule {}

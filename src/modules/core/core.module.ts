import { Module } from '@nestjs/common';
import { AppController } from './core.controller';
import { AppService } from './core.service';
import { DatabaseModule } from '@modules/database/database.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';
import DatabaseModuleEntities from '@modules/database/entities';
// import { NavigationModule } from '@modules/navigation/navigation.module';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: [...DatabaseModuleEntities],
      dbName: 'src/TayyareDependencies/nd.db3',
      driver: SqliteDriver,
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

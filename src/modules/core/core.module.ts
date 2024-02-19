import { Module } from '@nestjs/common';
import { AppController } from './core.controller';
import { AppService } from './core.service';
import { DatabaseModule } from '@modules/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { NavigationController } from './navigation.controller';
import { NavigationService } from './navigation.service';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '@modules/database/database.service';
import { FileSystemService } from '@modules/file-system/file-system.service';

@Module({
  imports: [DatabaseModule],
  controllers: [NavigationController],
  providers: [NavigationService, FileSystemService, DatabaseService],
})
export class NavigationModule {}

import { Module } from '@nestjs/common';
import { NavigationController } from './navigation.controller';
import { NavigationService } from './navigation.service';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '@modules/database/database.service';
import { FileSystemService } from '@modules/file-system/file-system.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [DatabaseModule, HttpModule],
  controllers: [NavigationController],
  providers: [NavigationService, FileSystemService, DatabaseService],
})
export class NavigationModule {}

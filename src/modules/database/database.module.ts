import { Module } from '@nestjs/common';
import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';
import { FileSystemModule } from '@modules/file-system/file-system.module';
import { FileSystemService } from '@modules/file-system/file-system.service';

@Module({
  imports: [FileSystemModule],
  controllers: [DatabaseController],
  providers: [DatabaseService, FileSystemService],
})
export class DatabaseModule {}

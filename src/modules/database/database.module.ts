import { Module } from '@nestjs/common';
import { DatabaseController } from './database.controller';
import { DatabaseService } from './database.service';
import { FileSystemModule } from '@modules/file-system/file-system.module';
import { FileSystemService } from '@modules/file-system/file-system.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import DatabaseModuleEntities from './entities';

@Module({
  imports: [
    FileSystemModule,
    MikroOrmModule.forFeature({
      entities: [...DatabaseModuleEntities],
    }),
  ],
  controllers: [DatabaseController],
  providers: [DatabaseService, FileSystemService],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { FileSystemService } from './file-system.service';

@Module({
  imports: [],
  controllers: [],
  providers: [FileSystemService],
})
export class FileSystemModule {}

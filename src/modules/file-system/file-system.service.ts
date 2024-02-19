import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileSystemService {
  async getFilesInFolder(folderPath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readdir(`src/${folderPath}`, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files.map((file) => path.join(folderPath, file)));
        }
      });
    });
  }

  async readFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(`src/${filePath}`, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  private uploadPath: string;

  constructor(private configService: ConfigService) {
    this.uploadPath = this.configService.get('UPLOAD_PATH') || './uploads';
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory() {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadPath, fileName);
    
    fs.writeFileSync(filePath, file.buffer);
    
    return fileName;
  }

  async deleteFile(fileName: string): Promise<void> {
    const filePath = path.join(this.uploadPath, fileName);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  getFilePath(fileName: string): string {
    return path.join(this.uploadPath, fileName);
  }
}











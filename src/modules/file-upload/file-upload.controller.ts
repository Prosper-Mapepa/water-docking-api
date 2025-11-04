import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';
import { Response } from 'express';
import * as fs from 'fs';

@ApiTags('File Upload')
@Controller('upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('single')
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const fileName = await this.fileUploadService.saveFile(file);
    return {
      fileName,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const fileName = await this.fileUploadService.saveFile(file);
        return {
          fileName,
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
        };
      }),
    );

    return { files: uploadedFiles };
  }

  @Get(':fileName')
  @ApiOperation({ summary: 'Get uploaded file' })
  async getFile(@Param('fileName') fileName: string, @Res() res: Response) {
    const filePath = this.fileUploadService.getFilePath(fileName);

    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }

    res.sendFile(filePath);
  }
}











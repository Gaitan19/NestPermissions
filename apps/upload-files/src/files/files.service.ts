/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async uploadFile(base64Image: string): Promise<File> {
    // const newFile = this.fileRepository.create({
    //   filename,
    //   base64Image,
    // });

    const newFile = this.fileRepository.create({
      image: base64Image,
    });

    return await this.fileRepository.save(newFile);
  }
  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  async findAll() {
    return await this.fileRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}

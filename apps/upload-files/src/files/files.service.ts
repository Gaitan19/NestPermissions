/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FilesService {
  // constructor(
  //   @InjectRepository(File)
  //   private readonly fileRepository: Repository<File>,
  // ) {}

  // async uploadFile(path: string): Promise<File> {
  // const newFile = this.fileRepository.create({
  //   filename,
  //   path,
  // });

  //   const newFile = this.fileRepository.create({
  //     path: path,
  //   });

  //   return await this.fileRepository.save(newFile);
  // }
  create(createFileDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  async findAll() {
    return 'This action adds a new file';
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

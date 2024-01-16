import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EmailLogsService } from './email-logs.service';
import { CreateEmailLogDto } from './dto/create-email-log.dto';
import { UpdateEmailLogDto } from './dto/update-email-log.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('email-logs')
export class EmailLogsController {
  constructor(private readonly emailLogsService: EmailLogsService) {}

  @Post()
  create(@Body() createEmailLogDto: CreateEmailLogDto) {
    return this.emailLogsService.create(createEmailLogDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.emailLogsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.emailLogsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateEmailLogDto: UpdateEmailLogDto,
  ) {
    return this.emailLogsService.update(+id, updateEmailLogDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.emailLogsService.remove(+id);
  }
}

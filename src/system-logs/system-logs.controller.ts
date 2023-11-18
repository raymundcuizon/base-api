import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { SystemLogsService } from './system-logs.service';
import { CreateSystemLogDto } from './dto/create-system-log.dto';
import { UpdateSystemLogDto } from './dto/update-system-log.dto';
import { Request } from 'express';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@Controller('system-logs')
@ApiHeader({ name: 'locale' })
@ApiTags('System logs')
export class SystemLogsController {
  constructor(private readonly systemLogsService: SystemLogsService) {}

  @Post()
  create(@Body() createSystemLogDto: CreateSystemLogDto) {
    return this.systemLogsService.create(createSystemLogDto);
  }

  @Get()
  findAll(@Req() request: Request) {
    const locale = request.locale;
    console.log(locale);
    return this.systemLogsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.systemLogsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSystemLogDto: UpdateSystemLogDto,
  ) {
    return this.systemLogsService.update(+id, updateSystemLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.systemLogsService.remove(+id);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ApiBody, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { ClientService } from 'src/client/client.service';

@Controller('departments')
export class DepartmentsController {
  constructor(
    private readonly clientService: ClientService,
    private readonly departmentsService: DepartmentsService,
  ) {}

  @Post()
  @ApiBody({ type: CreateDepartmentDto })
  @ApiCreatedResponse({
    description: 'New Department created',
    type: CreateDepartmentDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Department not available',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    const checkDepartment = await this.clientService.findOne(
      +createDepartmentDto.clientId,
    );

    const isDepartmentExist = await this.departmentsService.findByClientIdName(
      createDepartmentDto.name,
      +createDepartmentDto.clientId,
    );

    if (isDepartmentExist)
      throw new HttpException('Department already exist', HttpStatus.CONFLICT);

    return this.departmentsService.create(createDepartmentDto);
  }

  @Get()
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.departmentsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
  //   return this.departmentsService.update(+id, updateDepartmentDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentsService.remove(+id);
  }
}

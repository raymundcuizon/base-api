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
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { DepartmentsService } from 'src/departments/departments.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('positions')
@ApiTags('positions')
export class PositionsController {
  constructor(
    private readonly positionsService: PositionsService,
    private readonly departmentsService: DepartmentsService,
  ) {}

  @Post()
  @ApiBody({ type: CreatePositionDto })
  @ApiCreatedResponse({
    description: 'New Position created',
    type: CreatePositionDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Position not available',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async create(@Body() createPositionDto: CreatePositionDto) {
    await this.departmentsService.findOne(+createPositionDto.departmentId);

    const isPositionExist = await this.positionsService.findByPositionIdName(
      createPositionDto.name,
      +createPositionDto.departmentId,
    );

    if (isPositionExist)
      throw new HttpException('Position already exist', HttpStatus.CONFLICT);

    return this.positionsService.create(createPositionDto);
  }

  @Get()
  findAll() {
    return this.positionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.positionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdatePositionDto })
  @ApiCreatedResponse({
    description: 'New Position created',
    type: UpdatePositionDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Position not available',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  update(
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return this.positionsService.update(+id, updatePositionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.positionsService.remove(+id);
  }
}

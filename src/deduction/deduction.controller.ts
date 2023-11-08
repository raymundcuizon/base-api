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
import { DeductionService } from './deduction.service';
import { CreateDeductionDto } from './dto/create-deduction.dto';
import { UpdateDeductionDto } from './dto/update-deduction.dto';
import { ClientService } from 'src/client/client.service';
import { ApiBody, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';

@Controller('deduction')
export class DeductionController {
  constructor(
    private readonly clientService: ClientService,
    private readonly deductionService: DeductionService,
  ) {}

  @Post()
  @ApiBody({ type: CreateDeductionDto })
  @ApiCreatedResponse({
    description: 'New Deduction created',
    type: CreateDeductionDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Deduction not available',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async create(@Body() createDeductionDto: CreateDeductionDto) {
    // Validate if the client is exist
    await this.clientService.findOne(+createDeductionDto.clientId);

    const isDeductionExist = await this.deductionService.findByDeductionIdName(
      createDeductionDto.name,
      +createDeductionDto.clientId,
    );

    if (isDeductionExist)
      throw new HttpException('Deduction already exist', HttpStatus.CONFLICT);

    return this.deductionService.create(createDeductionDto);
  }

  @Get()
  findAll() {
    return this.deductionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deductionService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateDeductionDto })
  @ApiCreatedResponse({
    description: 'Deduction updated',
    type: UpdateDeductionDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Deduction not available',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  update(
    @Param('id') id: string,
    @Body() updateDeductionDto: UpdateDeductionDto,
  ) {
    return this.deductionService.update(+id, updateDeductionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deductionService.remove(+id);
  }
}

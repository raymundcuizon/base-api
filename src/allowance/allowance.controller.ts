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
import { AllowanceService } from './allowance.service';
import { CreateAllowanceDto } from './dto/create-allowance.dto';
import { UpdateAllowanceDto } from './dto/update-allowance.dto';
import { ClientService } from 'src/client/client.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('allowance')
@ApiTags('allowance')
export class AllowanceController {
  constructor(
    private readonly clientService: ClientService,
    private readonly allowanceService: AllowanceService,
  ) {}

  @Post()
  @ApiBody({ type: CreateAllowanceDto })
  @ApiCreatedResponse({
    description: 'New Allowance created',
    type: CreateAllowanceDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Allowance not available',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async create(@Body() createAllowanceDto: CreateAllowanceDto) {
    // Validate if the client is exist
    await this.clientService.findOne(+createAllowanceDto.clientId);

    const isAllowanceExist = await this.allowanceService.findByAllowanceIdName(
      createAllowanceDto.name,
      +createAllowanceDto.clientId,
    );

    if (isAllowanceExist)
      throw new HttpException('Allowance already exist', HttpStatus.CONFLICT);

    return this.allowanceService.create(createAllowanceDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  findAll() {
    return this.allowanceService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  findOne(@Param('id') id: string) {
    return this.allowanceService.findOne(+id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateAllowanceDto })
  @ApiCreatedResponse({
    description: 'Allowance updated',
    type: UpdateAllowanceDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Allowance not available',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  update(
    @Param('id') id: string,
    @Body() updateAllowanceDto: UpdateAllowanceDto,
  ) {
    return this.allowanceService.update(+id, updateAllowanceDto);
  }

  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.allowanceService.remove(+id);
  }
}

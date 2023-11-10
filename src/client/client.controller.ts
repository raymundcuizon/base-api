import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  HttpStatus,
  HttpException,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CompanyService } from 'src/company/company.service';
import { PaginateQueryParamsDto } from './dto/paginate-query-params.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Client } from './entities/client.entity';

@Controller('client')
export class ClientController {
  private logger = new Logger('ClientController');

  constructor(
    private readonly companyService: CompanyService,
    private readonly clientService: ClientService,
  ) {}

  @Post()
  @ApiBody({ type: CreateClientDto })
  @ApiCreatedResponse({
    description: 'New Client register',
    type: CreateClientDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Company not available',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async create(@Body() createClientDto: CreateClientDto) {
    const checkCompany = await this.companyService.findOne(
      +createClientDto.companyId,
    );

    const isClientExist = await this.clientService.findByCompanyIdName(
      createClientDto.name,
      +createClientDto.companyId,
    );

    if (isClientExist)
      throw new HttpException(
        'Client Company already exist',
        HttpStatus.CONFLICT,
      );

    return this.clientService.create(createClientDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Client>> {
    limit = limit > 100 ? 100 : limit;
    return this.clientService.findAll({
      page,
      limit,
      route: 'http://localhost:3001',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(+id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }
}

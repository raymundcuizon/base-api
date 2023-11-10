import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Logger,
  HttpException,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { CompanyResponseDto } from './dto/company-response.dto';
import { Company } from './entities/company.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('company')
export class CompanyController {
  private logger = new Logger('CompanyController');

  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiBody({ type: CreateCompanyDto })
  @ApiExtraModels(CompanyResponseDto)
  @ApiCreatedResponse({
    description: 'Company registration',
    type: CompanyResponseDto,
    schema: {
      $ref: getSchemaPath(CompanyResponseDto),
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'bad request',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Company not available',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    const validateComapny = await this.companyService.findByName(
      createCompanyDto.name,
    );

    if (validateComapny)
      throw new HttpException('Conpany not available', HttpStatus.CONFLICT);

    return this.companyService.create(createCompanyDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Company>> {
    limit = limit > 100 ? 100 : limit;
    return this.companyService.findAll({
      page,
      limit,
      route: 'http://localhost:3001',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}

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
  @ApiResponse({
    status: HttpStatus.OK,
    type: CompanyResponseDto,
  })
  findAll() {
    return this.companyService.findAll();
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

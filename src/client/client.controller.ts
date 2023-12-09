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
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CompanyService } from 'src/company/company.service';
import { PaginateQueryParamsDto } from './dto/paginate-query-params.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Client } from './entities/client.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/decorators/roles.guard';
import { AllowedRoles } from 'src/decorators/roles.decorator';
import { Role } from 'src/decorators/role.enum';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('company/client')
@ApiTags('Company - Client')
@ApiBearerAuth('access-token')
export class ClientController {
  private logger = new Logger('ClientController');

  constructor(
    private readonly companyService: CompanyService,
    private readonly clientService: ClientService,
  ) {}

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @AllowedRoles(Role.COM_ADMIN, Role.SYS_ADMIN)
  @ApiUnauthorizedResponse()
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
  async create(
    @GetUser() user: User,
    @Body() createClientDto: CreateClientDto,
  ) {
    const checkCompany = await this.companyService.findOne(+user.companyId);

    const isClientExist = await this.clientService.findByCompanyIdName(
      createClientDto.name,
      +user.companyId,
    );

    if (isClientExist)
      throw new HttpException(
        'Client Company already exist',
        HttpStatus.CONFLICT,
      );

    const data = { ...createClientDto, companyId: user.companyId };
    return this.clientService.create(data);
  }

  @Get()
  @UseGuards(AuthGuard(), RolesGuard)
  @AllowedRoles(Role.COM_ADMIN, Role.SYS_ADMIN)
  @ApiUnauthorizedResponse()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @GetUser() user: User,
  ): Promise<Pagination<Client>> {
    limit = limit > 100 ? 100 : limit;
    return this.clientService.findAll(
      {
        page,
        limit,
        route: '/',
      },
      user.companyId,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @AllowedRoles(Role.COM_ADMIN, Role.SYS_ADMIN)
  @ApiUnauthorizedResponse()
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @AllowedRoles(Role.COM_ADMIN, Role.SYS_ADMIN)
  @ApiUnauthorizedResponse()
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(+id, updateClientDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), RolesGuard)
  @AllowedRoles(Role.COM_ADMIN, Role.SYS_ADMIN)
  @ApiUnauthorizedResponse()
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }
}

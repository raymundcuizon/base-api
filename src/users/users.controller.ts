import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserSuccessDto } from './dto/create-user-success.dto';
import { Role } from 'src/decorators/role.enum';
import { User } from './entities/user.entity';
import { GetUser } from 'src/decorators/get-user.decorator';
import { RolesGuard } from 'src/decorators/roles.guard';
import { AllowedRoles } from 'src/decorators/roles.decorator';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  // @Roles(Role.Admin)
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'User registration',
    type: CreateUserSuccessDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Username already exists',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
  })
  @ApiCreatedResponse({
    description: 'user registration',
  })
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const validateUser = await this.usersService.findOneUsername(
      createUserDto.username,
    );
    if (validateUser)
      throw new BadRequestException('username is already exist');
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard(), RolesGuard)
  @AllowedRoles(Role.COM_ADMIN)
  @ApiUnauthorizedResponse()
  @ApiBearerAuth('access-token')
  findAll(@GetUser() user: User) {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiUnauthorizedResponse()
  @ApiBearerAuth('access-token')
  findOne(@Param('id') id: string) {
    return '';
    // return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @ApiUnauthorizedResponse()
  @ApiBearerAuth('access-token')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiUnauthorizedResponse()
  @ApiBearerAuth('access-token')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

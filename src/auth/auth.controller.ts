import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Query,
  Logger,
  UnauthorizedException,
  UseGuards,
  Patch,
  Param,
  Delete,
  BadRequestException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SigninUserDTO } from './dto/signinUser.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';
import {
  SigninResponseDTO,
  SigninResponseNeedToactivateDTO,
} from './dto/signinResponse.dto';
import { RefreshDto } from './dto/refreshDto';
import { Locale } from '../decorators/locale.decorator';
import { userType } from 'src/users/entities/user.entity';
import { ActivateNewUserDTO } from './dto/activateNewUser.dto';

@Controller('auth')
@ApiHeader({ name: 'locale' })
@ApiTags('auth')
export class AuthController {
  private logger = new Logger('AuthController');
  constructor(private readonly authService: AuthService) {}

  // @Post('signup')
  // create(@Body() createAuthDto: CreateAuthDto, @Locale() locale: string) {
  //   console.log(locale)
  //   return this.authService.create(createAuthDto);
  // }

  @Post('signin')
  @HttpCode(200)
  @ApiResponse({
    status: HttpStatus.OK,
    type: SigninResponseDTO,
    description: 'successfully login',
  })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    type: SigninResponseNeedToactivateDTO,
    description: 'successfully login but need to enter new password',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  @ApiBody({ type: SigninUserDTO })
  async signIn(
    @Body() signinUserDTO: SigninUserDTO,
  ): Promise<SigninResponseDTO | SigninResponseNeedToactivateDTO> {
    const user = await this.authService.validateUserPassword(signinUserDTO);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.type === userType.CLI_ADMIN && !user.isActivated)
      return {
        activationCode: user.activationCode,
        type: 'new_password_required',
      };

    const token = await this.authService.genToken(user);
    return { ...token, type: 'success' };
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, type: SigninResponseDTO })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  authRefresh(@Body() refreshDto: RefreshDto): Promise<SigninResponseDTO> {
    return this.authService.authRefresh(refreshDto.refreshToken);
  }

  @Post('activate-new-user')
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, type: ActivateNewUserDTO })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  activateNewAccount(@Body() data: ActivateNewUserDTO): Promise<void> {
    return this.authService.activateNewAccount(
      data.activationCode,
      data.password,
    );
  }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}

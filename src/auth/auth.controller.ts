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
  HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { SigninUserDTO } from './dto/signinUser.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBody,
  ApiBearerAuth,
  ApiResponse, ApiHeader } from '@nestjs/swagger';
import { SigninResponseDTO } from './dto/signinResponse.dto';
import { RefreshDto } from './dto/refreshDto';
import { Locale } from '../decorators/locale.decorator';


@Controller('auth')
@ApiHeader({ name: 'locale' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('signup')
  // create(@Body() createAuthDto: CreateAuthDto, @Locale() locale: string) {
  //   console.log(locale)
  //   return this.authService.create(createAuthDto);
  // }

  @Post('signin')
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, type: SigninResponseDTO })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException,  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  @ApiBody({type: SigninUserDTO})
  async signIn(@Body() signinUserDTO: SigninUserDTO): Promise<SigninResponseDTO> {

    const user = await this.authService.validateUserPassword(signinUserDTO);

    if (!user) throw new UnauthorizedException('Invalid credentials'); 

    return await this.authService.genToken(user);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, type: SigninResponseDTO })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  authRefresh( @Body() refreshDto: RefreshDto): Promise<SigninResponseDTO> {
    return this.authService.authRefresh(refreshDto.refreshToken);
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

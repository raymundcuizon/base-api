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
  ApiResponse } from '@nestjs/swagger';
import { SigninResponseDTO } from './dto/signinResponse.dto';
import { RefreshDto } from './dto/refreshDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('signin')
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, type: SigninResponseDTO })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  @ApiBody({type: SigninUserDTO})
  signIn(@Body() signinUserDTO: SigninUserDTO): Promise<SigninResponseDTO> {
    return this.authService.signIn(signinUserDTO);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiResponse({ status: HttpStatus.OK, type: SigninResponseDTO })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, type: UnauthorizedException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BadRequestException })
  authRefresh( @Body() refreshDto: RefreshDto): Promise<SigninResponseDTO> {
    return this.authService.authRefresh(refreshDto.refreshToken);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}

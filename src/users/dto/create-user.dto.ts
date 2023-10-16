import { ApiHeader, ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches, IsBoolean } from 'class-validator';
import { Locale } from '../../decorators/locale.decorator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty({type: String, description: 'username'})
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'password too weak' },
  )
  @ApiProperty({type: String, description: 'password'})
  password: string;

  @IsString()
  @ApiProperty({type: String, description: 'email'})
  email: string;

  @IsString()
  @ApiProperty({type: String, description: 'firstname'})
  firstname: string;

  @IsString()
  @ApiProperty({type: String, description: 'lastname'})
  lastname: string;

  @IsString()
  @ApiProperty({type: String, description: 'string'})
  mobileNumber: string;

}

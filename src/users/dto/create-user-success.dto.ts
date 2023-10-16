import { ApiHeader, ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches, IsBoolean } from 'class-validator';

export class CreateUserSuccessDto {

  @ApiProperty({type: Number, description: 'id'})
  id: number;
  
  @ApiProperty({type: String, description: 'username'})
  username: string;

  @ApiProperty({type: String, description: 'email'})
  email: string;

  @ApiProperty({type: String, description: 'firstname'})
  firstname: string;

  @ApiProperty({type: String, description: 'lastname'})
  lastname: string;

  @ApiProperty({type: String, description: 'mobileNumber'})
  mobileNumber: string;

}

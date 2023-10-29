import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class ActivateNewUserDTO {
  @IsNumber()
  @ApiProperty({ type: String, description: 'user activationCode' })
  activationCode: string;

  @IsString()
  @ApiProperty({ type: String, description: 'user password' })
  password: string;
}

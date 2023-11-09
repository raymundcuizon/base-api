import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateClientDto {
  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'Client name' })
  name: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'Client email' })
  email: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'Client Address' })
  address: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'Client Contact number' })
  contact_number: string;
}

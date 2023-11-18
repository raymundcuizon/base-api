import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'Company name' })
  name: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'Company email' })
  email: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'Company Address' })
  address: string;

  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'Company Contact number' })
  contact_number: string;
}

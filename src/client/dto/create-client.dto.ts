import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'Client name' })
  name: string;

  @IsNumber()
  @ApiProperty({ type: Number, description: 'Company Id' })
  companyId: number;
}

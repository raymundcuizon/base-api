import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateDepartmentDto {
  @IsNumber()
  @ApiProperty({ type: Number, description: 'Client Id' })
  clientId: number;

  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'Company name' })
  name: string;
}

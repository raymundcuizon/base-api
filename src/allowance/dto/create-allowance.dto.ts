import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreateAllowanceDto {
  @IsNumber()
  @ApiProperty({ type: Number, description: 'Client Id' })
  clientId: number;

  @IsString()
  @MinLength(2)
  @ApiProperty({ type: String, description: 'Deduction name' })
  name: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({ type: String, description: 'Deduction description' })
  description: string;
}

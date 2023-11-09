import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDeductionDto } from './create-deduction.dto';
import { IsString, MinLength } from 'class-validator';

export class UpdateDeductionDto {
  @IsString()
  @MinLength(2)
  @ApiProperty({ type: String, description: 'Deduction name' })
  name: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({ type: String, description: 'Description name' })
  description: string;
}

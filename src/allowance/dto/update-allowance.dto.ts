import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAllowanceDto } from './create-allowance.dto';
import { IsString, MinLength } from 'class-validator';

export class UpdateAllowanceDto extends PartialType(CreateAllowanceDto) {
  @IsString()
  @MinLength(2)
  @ApiProperty({ type: String, description: 'Deduction name' })
  name: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({ type: String, description: 'Deduction description' })
  description: string;
}

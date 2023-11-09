import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDepartmentDto {
  @IsString()
  @MinLength(2)
  @ApiProperty({ type: String, description: 'Company name' })
  name: string;
}

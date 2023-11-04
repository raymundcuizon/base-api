import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartmentDto } from './create-department.dto';
import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {
  @IsString()
  @MinLength(2)
  @ApiProperty({ type: String, description: 'Company name' })
  name: string;
}

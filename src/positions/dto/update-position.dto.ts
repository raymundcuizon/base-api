import { PartialType } from '@nestjs/mapped-types';
import { CreatePositionDto } from './create-position.dto';
import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePositionDto extends PartialType(CreatePositionDto) {
  @IsString()
  @MinLength(2)
  @ApiProperty({ type: String, description: 'position name' })
  name: string;
}

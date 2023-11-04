import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class CreatePositionDto {
  @IsNumber()
  @ApiProperty({ type: Number, description: 'Department Id' })
  departmentId: number;

  @IsString()
  @MinLength(2)
  @ApiProperty({ type: String, description: 'position name' })
  name: string;
}

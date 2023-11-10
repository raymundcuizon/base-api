import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class PaginateQueryParamsDto {
  @IsNumber()
  @ApiProperty({ type: Number, description: 'page' })
  page: number;

  @IsNumber()
  @ApiProperty({ type: Number, description: 'limit' })
  limit: number;
}

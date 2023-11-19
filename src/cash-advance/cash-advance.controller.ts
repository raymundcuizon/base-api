import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CashAdvanceService } from './cash-advance.service';
import { CreateCashAdvanceDto } from './dto/create-cash-advance.dto';
import { UpdateCashAdvanceDto } from './dto/update-cash-advance.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('cash-advance')
@ApiTags('cash-advance')
export class CashAdvanceController {
  constructor(private readonly cashAdvanceService: CashAdvanceService) {}

  @Post()
  create(@Body() createCashAdvanceDto: CreateCashAdvanceDto) {
    return this.cashAdvanceService.create(createCashAdvanceDto);
  }

  @Get()
  findAll() {
    return this.cashAdvanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashAdvanceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCashAdvanceDto: UpdateCashAdvanceDto,
  ) {
    return this.cashAdvanceService.update(+id, updateCashAdvanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashAdvanceService.remove(+id);
  }
}

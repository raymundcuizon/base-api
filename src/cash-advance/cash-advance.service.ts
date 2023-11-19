import { Injectable } from '@nestjs/common';
import { CreateCashAdvanceDto } from './dto/create-cash-advance.dto';
import { UpdateCashAdvanceDto } from './dto/update-cash-advance.dto';

@Injectable()
export class CashAdvanceService {
  create(createCashAdvanceDto: CreateCashAdvanceDto) {
    return 'This action adds a new cashAdvance';
  }

  findAll() {
    return `This action returns all cashAdvance`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cashAdvance`;
  }

  update(id: number, updateCashAdvanceDto: UpdateCashAdvanceDto) {
    return `This action updates a #${id} cashAdvance`;
  }

  remove(id: number) {
    return `This action removes a #${id} cashAdvance`;
  }
}

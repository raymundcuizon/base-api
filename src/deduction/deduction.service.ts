import { Injectable } from '@nestjs/common';
import { CreateDeductionDto } from './dto/create-deduction.dto';
import { UpdateDeductionDto } from './dto/update-deduction.dto';

@Injectable()
export class DeductionService {
  create(createDeductionDto: CreateDeductionDto) {
    return 'This action adds a new deduction';
  }

  findAll() {
    return `This action returns all deduction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} deduction`;
  }

  update(id: number, updateDeductionDto: UpdateDeductionDto) {
    return `This action updates a #${id} deduction`;
  }

  remove(id: number) {
    return `This action removes a #${id} deduction`;
  }
}

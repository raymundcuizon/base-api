import { Module } from '@nestjs/common';
import { CashAdvanceService } from './cash-advance.service';
import { CashAdvanceController } from './cash-advance.controller';

@Module({
  controllers: [CashAdvanceController],
  providers: [CashAdvanceService]
})
export class CashAdvanceModule {}

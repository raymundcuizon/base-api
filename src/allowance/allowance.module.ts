import { Module } from '@nestjs/common';
import { AllowanceService } from './allowance.service';
import { AllowanceController } from './allowance.controller';
import { allowanceProviders } from './allowance.provider';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [AllowanceController],
  providers: [AllowanceService, ...allowanceProviders],
})
export class AllowanceModule {}

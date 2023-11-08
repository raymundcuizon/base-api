import { Module } from '@nestjs/common';
import { AllowanceService } from './allowance.service';
import { AllowanceController } from './allowance.controller';
import { allowanceProviders } from './allowance.provider';
import { DatabaseModule } from 'src/database/database.module';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [DatabaseModule, ClientModule],
  controllers: [AllowanceController],
  providers: [AllowanceService, ...allowanceProviders],
})
export class AllowanceModule {}

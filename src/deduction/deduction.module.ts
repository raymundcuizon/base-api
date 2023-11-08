import { Module } from '@nestjs/common';
import { DeductionService } from './deduction.service';
import { DeductionController } from './deduction.controller';
import { deductionProviders } from './deduction.provider';
import { DatabaseModule } from 'src/database/database.module';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [DatabaseModule, ClientModule],
  controllers: [DeductionController],
  providers: [DeductionService, ...deductionProviders],
})
export class DeductionModule {}

import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { DatabaseModule } from 'src/database/database.module';
import { compnayProviders } from './company.provider';

@Module({
  imports: [DatabaseModule],
  controllers: [CompanyController],
  providers: [
    ...compnayProviders,
    CompanyService
  ]
})
export class CompanyModule {}

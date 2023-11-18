import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { DatabaseModule } from 'src/database/database.module';
import { compnayProviders } from './company.provider';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [CompanyController],
  exports: [CompanyService],
  providers: [...compnayProviders, CompanyService],
})
export class CompanyModule {}

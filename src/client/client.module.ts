import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { clientProviders } from './client.provider';
import { DatabaseModule } from 'src/database/database.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [DatabaseModule, CompanyModule],
  controllers: [ClientController],
  providers: [...clientProviders, ClientService],
})
export class ClientModule {}

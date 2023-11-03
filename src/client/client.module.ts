import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { clientProviders } from './client.provider';
import { DatabaseModule } from 'src/database/database.module';
import { CompanyModule } from 'src/company/company.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [DatabaseModule, CompanyModule, UsersModule],
  controllers: [ClientController],
  exports: [ClientService],
  providers: [...clientProviders, ClientService],
})
export class ClientModule {}

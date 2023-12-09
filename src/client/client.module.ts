import { Module, forwardRef } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { clientProviders } from './client.provider';
import { DatabaseModule } from 'src/database/database.module';
import { CompanyModule } from 'src/company/company.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    CompanyModule,
    UsersModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [ClientController],
  exports: [ClientService],
  providers: [...clientProviders, ClientService],
})
export class ClientModule {}

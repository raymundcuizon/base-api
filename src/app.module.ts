import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SystemLogsModule } from './system-logs/system-logs.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PositionsModule } from './positions/positions.module';
import { CompanyModule } from './company/company.module';
import { DepartmentsModule } from './departments/departments.module';
import { EmployeesModule } from './employees/employees.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SystemLogsModule, UsersModule, AuthModule, PositionsModule, CompanyModule, DepartmentsModule, EmployeesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

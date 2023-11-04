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
import { configValidationSchema } from './config.schema';
import { ClientModule } from './client/client.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LocaleInterceptor } from './locale/locale.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`stage.${process.env.STAGE}.env`],
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    DatabaseModule,
    SystemLogsModule,
    UsersModule,
    AuthModule,
    PositionsModule,
    CompanyModule,
    DepartmentsModule,
    EmployeesModule,
    ClientModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LocaleInterceptor,
    },
  ],
})
export class AppModule {}

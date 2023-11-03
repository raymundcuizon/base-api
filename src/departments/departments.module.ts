import { Module } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsController } from './departments.controller';
import { departmentProviders } from './department.provider';
import { DatabaseModule } from 'src/database/database.module';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [DatabaseModule, ClientModule],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, ...departmentProviders],
})
export class DepartmentsModule {}

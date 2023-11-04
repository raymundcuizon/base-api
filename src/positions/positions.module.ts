import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { positionProviders } from './position.provider';
import { DepartmentsModule } from 'src/departments/departments.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DepartmentsModule, DatabaseModule],
  controllers: [PositionsController],
  providers: [PositionsService, ...positionProviders],
})
export class PositionsModule {}

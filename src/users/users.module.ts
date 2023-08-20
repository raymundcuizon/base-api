import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { userProviders } from './users.provider';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => AuthModule)
  ],
  controllers: [UsersController],
  providers: [
    ...userProviders,
    UsersService
  ]
})
export class UsersModule {}

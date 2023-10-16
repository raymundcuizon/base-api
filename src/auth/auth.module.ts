import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from 'src/users/users.provider';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
    ConfigModule.forRoot({
      envFilePath: [`stage.${process.env.STAGE}.env`],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ global: true,secret: process.env.JWT_SECRET, signOptions: { expiresIn: '60s' } }),
    DatabaseModule,
    forwardRef(() => UsersModule)
  ],
  controllers: [AuthController],
  providers: [
    ...userProviders,
    AuthService,
    JwtStrategy,
  ],
  exports: [
    JwtStrategy,
    PassportModule,
  ]
})
export class AuthModule {}

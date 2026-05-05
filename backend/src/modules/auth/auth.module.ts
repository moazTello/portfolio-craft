import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailModule } from '../email/email.module';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './google.strategy';
import { GithubStrategy } from './github.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    EmailModule,
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'secret',
      signOptions: { expiresIn: '30m' },
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy, GithubStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

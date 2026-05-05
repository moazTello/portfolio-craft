// import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common'
// import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
// import { AuthService } from './auth.service'
// import { RegisterDto } from './dto/register.dto'
// import { LoginDto } from './dto/login.dto'
// import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
// import { CurrentUser } from '../../common/decorators/current-user.decorator'

// @ApiTags('Auth')
// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('register')
//   @ApiOperation({ summary: 'Register new user' })
//   register(@Body() dto: RegisterDto) {
//     return this.authService.register(dto)
//   }

//   @Post('login')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Login' })
//   login(@Body() dto: LoginDto) {
//     return this.authService.login(dto)
//   }

//   @Get('me')
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Get current user' })
//   me(@CurrentUser() user: any) {
//     return user
//   }
// }

import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
// import { Response, Request } from 'express';
import type { Response } from 'express'

class ForgotPasswordDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}

class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}

// @ApiTags('Auth')
// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('register')
//   @ApiOperation({ summary: 'Register new user' })
//   register(@Body() dto: RegisterDto) {
//     return this.authService.register(dto);
//   }

//   @Post('login')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Login' })
//   login(@Body() dto: LoginDto) {
//     return this.authService.login(dto);
//   }

//   @Get('verify-email')
//   @ApiOperation({ summary: 'Verify email' })
//   verifyEmail(@Query('token') token: string) {
//     return this.authService.verifyEmail(token);
//   }

//   @Post('forgot-password')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Forgot password' })
//   forgotPassword(@Body() dto: ForgotPasswordDto) {
//     return this.authService.forgotPassword(dto.email);
//   }

//   @Post('reset-password')
//   @HttpCode(HttpStatus.OK)
//   @ApiOperation({ summary: 'Reset password' })
//   resetPassword(@Body() dto: ResetPasswordDto) {
//     return this.authService.resetPassword(dto.token, dto.newPassword);
//   }

//   @Get('me')
//   @UseGuards(JwtAuthGuard)
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Get current user' })
//   me(@CurrentUser() user: any) {
//     return user;
//   }
// }
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ short: { limit: 3, ttl: 60000 } }) // max 3 registers per minute
  @ApiOperation({ summary: 'Register new user' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @Throttle({ short: { limit: 5, ttl: 60000 } }) // max 5 logins per minute
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-password')
  @Throttle({ short: { limit: 3, ttl: 60000 } }) // max 3 per minute
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Forgot password' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Get('verify-email')
  @SkipThrottle() // no limit on verify
  @ApiOperation({ summary: 'Verify email' })
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Get('me')
  @SkipThrottle() // no limit on me
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  me(@CurrentUser() user: any) {
    return user;
  }

  @Post('reset-password')
  @Throttle({ short: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  // Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Login with Google' })
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const tokens = await this.authService.generateTokens(req.user);
    const frontendUrl = this.authService.getFrontendUrl();
    res.redirect(
      `${frontendUrl}/auth/oauth-callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`,
    );
  }

  // GitHub
  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Login with GitHub' })
  githubAuth() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'GitHub OAuth callback' })
  async githubCallback(@Req() req: any, @Res() res: Response) {
    const tokens = await this.authService.generateTokens(req.user);
    const frontendUrl = this.authService.getFrontendUrl();
    res.redirect(
      `${frontendUrl}/auth/oauth-callback?token=${tokens.accessToken}&refresh=${tokens.refreshToken}`,
    );
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }
}

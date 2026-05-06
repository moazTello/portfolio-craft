// import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common'
// import { JwtService } from '@nestjs/jwt'
// import { UsersService } from '../users/users.service'
// import { RegisterDto } from './dto/register.dto'
// import { LoginDto } from './dto/login.dto'
// import * as bcrypt from 'bcrypt'

// @Injectable()
// export class AuthService {
//   constructor(
//     private users: UsersService,
//     private jwt: JwtService,
//   ) {}

//   async register(dto: RegisterDto) {
//     const existing = await this.users.findByEmail(dto.email)
//     if (existing) throw new ConflictException('Email already in use')

//     const passwordHash = await bcrypt.hash(dto.password, 12)
//     const user = await this.users.create({
//       name: dto.name,
//       email: dto.email,
//       passwordHash,
//     })

//     return this.generateToken(user.id, user.email, user.role)
//   }

//   async login(dto: LoginDto) {
//     const user = await this.users.findByEmail(dto.email)
//     if (!user || !user.passwordHash)
//       throw new UnauthorizedException('Invalid credentials')

//     const valid = await bcrypt.compare(dto.password, user.passwordHash)
//     if (!valid) throw new UnauthorizedException('Invalid credentials')

//     return this.generateToken(user.id, user.email, user.role)
//   }

//   private generateToken(userId: string, email: string, role: string) {
//     const payload = { sub: userId, email, role }
//     return {
//       accessToken: this.jwt.sign(payload),
//     }
//   }
// }
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';
// import { v4 as uuid } from 'uuid';
import { randomUUID } from 'crypto'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
    private email: EmailService,
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    // const verificationToken = uuid();
    const verificationToken = randomUUID();

    const user = await this.users.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      verificationToken,
    });

    // Send verification email
    await this.email.sendVerificationEmail(
      user.email,
      user.name,
      verificationToken,
    );

    return {
      message:
        'Registration successful! Please check your email to verify your account.',
    };
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) throw new BadRequestException('Invalid or expired token');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationToken: null },
    });

    return this.generateToken(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user || !user.passwordHash)
      throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (!user.emailVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    return this.generateToken(user.id, user.email, user.role);
  }

  async forgotPassword(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user)
      return {
        message: 'If this email exists, you will receive a reset link.',
      };

    // const token = uuid();
    const token = randomUUID();
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: token, resetPasswordExpiry: expiry },
    });

    await this.email.sendPasswordResetEmail(user.email, user.name, token);

    return { message: 'If this email exists, you will receive a reset link.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiry: { gt: new Date() },
      },
    });

    if (!user) throw new BadRequestException('Invalid or expired token');

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpiry: null,
      },
    });

    return { message: 'Password reset successful!' };
  }

  private generateToken(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };
    return { accessToken: this.jwt.sign(payload) };
  }

  async findOrCreateOAuthUser(data: {
    email: string;
    name: string;
    oauthProvider: string;
    oauthId: string;
    avatarUrl?: string;
  }) {
    // ابحث بالـ email أول
    let user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (user) {
      // حدّث الـ OAuth info إذا كان موجود
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          oauthProvider: data.oauthProvider,
          oauthId: data.oauthId,
          emailVerified: true,
          ...(data.avatarUrl &&
            !user.avatarUrl && { avatarUrl: data.avatarUrl }),
        },
      });
    } else {
      // أنشئ مستخدم جديد
      user = await this.prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          oauthProvider: data.oauthProvider,
          oauthId: data.oauthId,
          avatarUrl: data.avatarUrl,
          emailVerified: true,
          passwordHash: null,
        },
      });
    }

    return user;
  }

  getFrontendUrl() {
    return this.config.get('FRONTEND_URL') ?? 'http://localhost:3000';
  }

  async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '30m', // ← قصير للأمان
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: '30d', // ← طويل للراحة
    });

    return { accessToken, refreshToken };
  }
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) throw new Error();
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}

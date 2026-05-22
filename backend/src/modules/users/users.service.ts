import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UploadService } from '../../common/services/upload.service'
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService,private uploadService: UploadService,) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    const { passwordHash, ...rest } = user;
    return rest;
  }
  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
    verificationToken?: string;
  }) {
    return this.prisma.user.create({ data });
  }
  // async create(data: { name: string; email: string; passwordHash: string }) {
  //   return this.prisma.user.create({ data });
  // }
  async update(id: string, data: { name?: string; email?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
  }

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user?.passwordHash) throw new UnauthorizedException();

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid)
      throw new UnauthorizedException('Current password is incorrect');

    const passwordHash = await bcrypt.hash(newPassword, 12);
    return this.prisma.user.update({
      where: { id },
      data: { passwordHash },
      select: { id: true },
    });
  }
  // async updateAvatar(id: string, avatarUrl: string) {
  //   return this.prisma.user.update({
  //     where: { id },
  //     data: { avatarUrl },
  //     select: {
  //       id: true,
  //       name: true,
  //       email: true,
  //       avatarUrl: true,
  //     },
  //   });
  // }
  async delete(id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
    async updateAvatar(id: string, avatarBase64: string) {
    // ارفع على Cloudinary
    const avatarUrl = await this.uploadService.uploadImage(
      avatarBase64,
      'portfoliocraft/avatars'
    )

    return this.prisma.user.update({
      where: { id },
      data: { avatarUrl },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
      },
    })
  }
}

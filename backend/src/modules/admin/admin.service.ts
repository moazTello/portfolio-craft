import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config'
@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async getStats() {
    const [totalUsers, totalPortfolios, publishedPortfolios, totalMessages] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.portfolio.count(),
        this.prisma.portfolio.count({ where: { published: true } }),
        this.prisma.message.count(),
      ]);

    const planBreakdown = await this.prisma.user.groupBy({
      by: ['plan'],
      _count: { plan: true },
    });

    return {
      totalUsers,
      totalPortfolios,
      publishedPortfolios,
      totalMessages,
      planBreakdown,
    };
  }

  async getUsers(page = 1, limit = 20, search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as any } },
            { email: { contains: search, mode: 'insensitive' as any } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          plan: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          portfolio: { select: { username: true, published: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total, page, limit };
  }

  async updateUserPlan(userId: string, plan: string, months: number = 1) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + months);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        plan: plan as any,
        planExpiresAt: expiresAt,
      },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        planExpiresAt: true,
      },
    });
  }

  async suspendUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { emailVerified: false },
    });
  }

  async deleteUser(userId: string) {
    return this.prisma.user.delete({ where: { id: userId } });
  }

  async verifyUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });
  }

  async sendMessageToUser(userId: string, subject: string, body: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const { Resend } = await import('resend');
    const resend = new Resend(this.config.get('RESEND_API_KEY'));

    await resend.emails.send({
      from: 'PortfolioCraft <no-reply@portfolio-craft.com>',
      to: user.email,
      subject,
      html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px">
        <div style="margin-bottom:24px">
          <span style="color:#6366f1;font-weight:600;font-size:18px">PortfolioCraft</span>
        </div>
        <div style="white-space:pre-wrap;font-size:14px;line-height:1.8;color:#374151">
          ${body.replace(/\n/g, '<br/>')}
        </div>
        <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:12px;color:#9ca3af">
          © 2026 PortfolioCraft · <a href="https://www.portfolio-craft.com" style="color:#6366f1">portfolio-craft.com</a>
        </div>
      </div>
    `,
    });

    return { success: true };
  }
}

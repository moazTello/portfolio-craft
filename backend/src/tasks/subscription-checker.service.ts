import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../database/prisma.service';
import { PortfolioService } from '../modules/portfolio/portfolio.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubscriptionCheckerService {
  constructor(
    private prisma: PrismaService,
    private portfolioService: PortfolioService,
    private config: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkExpiredSubscriptions() {
    const now = new Date();

    const expiredUsers = await this.prisma.user.findMany({
      where: {
        plan: { not: 'FREE' },
        planExpiresAt: { lte: now },
        stripeSubscriptionId: null,
      },
      include: { portfolio: true },
    });

    for (const user of expiredUsers) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { plan: 'FREE', planExpiresAt: null },
      });

      if (user.portfolio?.customDomain) {
        await this.portfolioService.removeDomainFromVercel(
          user.portfolio.customDomain,
        );
      }

      console.log(`Subscription expired: ${user.email}`);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async warnExpiringSubscriptions() {
    const now = new Date();
    const in7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const expiringUsers = await this.prisma.user.findMany({
      where: {
        plan: { not: 'FREE' },
        planExpiresAt: { gte: now, lte: in7Days },
        stripeSubscriptionId: null,
      },
    });

    for (const user of expiringUsers) {
      const daysLeft = Math.ceil(
        (user.planExpiresAt!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );

      try {
        const { Resend } = await import('resend');
        const resend = new Resend(this.config.get('RESEND_API_KEY'));
        await resend.emails.send({
          from: 'PortfolioCraft <no-reply@portfolio-craft.com>',
          to: user.email,
          subject: `⚠️ Your subscription expires in ${daysLeft} days`,
          html: `
            <div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:32px">
              <h2 style="color:#4F46E5">Your subscription is expiring soon</h2>
              <p>Your PortfolioCraft ${user.plan} plan expires in <strong>${daysLeft} days</strong>.</p>
              <p>After expiry your portfolio will be limited to Free plan features.</p>
              <a href="https://www.portfolio-craft.com/dashboard/settings/billing"
                style="display:inline-block;background:#4F46E5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">
                Renew Subscription →
              </a>
            </div>
          `,
        });
      } catch (e) {
        console.error('Warning email error:', e);
      }
    }
  }
}

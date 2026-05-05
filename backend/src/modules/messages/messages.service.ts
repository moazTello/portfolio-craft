import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { EmailService } from '../email/email.service';
import { TelegramService } from './telegram.service';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private email: EmailService,
    private telegram: TelegramService,
  ) {}

  async send(
    portfolioId: string,
    data: {
      senderName: string;
      senderEmail: string;
      subject?: string;
      content: string;
    },
  ) {
    const message = await this.prisma.message.create({
      data: { portfolioId, ...data },
    });

    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: {
        user: { select: { email: true, name: true, telegramChatId: true } },
      },
    });

    if (portfolio?.user) {
      // Email notification
      await this.email
        .sendContactNotification(
          portfolio.user.email,
          portfolio.user.name,
          data.senderName,
          data.senderEmail,
          data.subject ?? 'New message',
          data.content,
        )
        .catch(() => {});

      // Telegram notification
      if (portfolio.user.telegramChatId) {
        const text = `
                📬 <b>New message on your portfolio!</b>
                👤 <b>From:</b> ${data.senderName}
                📧 <b>Email:</b> ${data.senderEmail}
                📌 <b>Subject:</b> ${data.subject || 'No subject'}
                💬 <b>Message:</b>
          ${data.content}
        `.trim();

        await this.telegram.sendMessage(portfolio.user.telegramChatId, text);
      }
    }
    return { success: true, id: message.id };
  }

  // async send(
  //   portfolioId: string,
  //   data: {
  //     senderName: string;
  //     senderEmail: string;
  //     subject?: string;
  //     content: string;
  //   },
  // ) {
  //   // Save to DB
  //   const message = await this.prisma.message.create({
  //     data: { portfolioId, ...data },
  //   });

  //   // Get portfolio owner email
  //   const portfolio = await this.prisma.portfolio.findUnique({
  //     where: { id: portfolioId },
  //     include: { user: { select: { email: true, name: true } } },
  //   });

  //   // Send email notification
  //   if (portfolio?.user?.email) {
  //     await this.email.sendContactNotification(
  //       portfolio.user.email,
  //       portfolio.user.name,
  //       data.senderName,
  //       data.senderEmail,
  //       data.subject ?? 'New message',
  //       data.content,
  //     );
  //   }

  //   return { success: true, id: message.id };
  // }

  async findAll(userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { userId },
    });
    if (!portfolio) return [];

    return this.prisma.message.findMany({
      where: { portfolioId: portfolio.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markRead(userId: string, id: string) {
    return this.prisma.message.update({
      where: { id },
      data: { read: true },
    });
  }

  async delete(userId: string, id: string) {
    return this.prisma.message.delete({ where: { id } });
  }

  async getUnreadCount(userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { userId },
    });
    if (!portfolio) return { count: 0 };

    const count = await this.prisma.message.count({
      where: { portfolioId: portfolio.id, read: false },
    });
    return { count };
  }
}

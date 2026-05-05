import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class BookingService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  // ─── Availability ───────────────────────────────────────
  private async checkBusinessPlan(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.plan !== 'BUSINESS') {
      throw new ForbiddenException(
        'Booking system is available on Business plan only',
      );
    }
  }
  async getAvailability(userId: string) {
    await this.checkBusinessPlan(userId);
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { userId },
    });
    if (!portfolio) throw new NotFoundException('Portfolio not found');

    return this.prisma.availability.findMany({
      where: { portfolioId: portfolio.id },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async setAvailability(
    userId: string,
    slots: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      isActive: boolean;
    }[],
  ) {
    await this.checkBusinessPlan(userId);
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { userId },
    });
    if (!portfolio) throw new NotFoundException('Portfolio not found');

    // Delete existing and recreate
    await this.prisma.availability.deleteMany({
      where: { portfolioId: portfolio.id },
    });

    return this.prisma.availability.createMany({
      data: slots.map((slot) => ({
        portfolioId: portfolio.id,
        ...slot,
      })),
    });
  }

  async toggleBooking(userId: string, enabled: boolean) {
    await this.checkBusinessPlan(userId);
    return this.prisma.portfolio.update({
      where: { userId },
      data: { bookingEnabled: enabled },
    });
  }

  async updateBookingSettings(
    userId: string,
    data: {
      bookingDuration?: number;
      bookingBuffer?: number;
    },
  ) {
    await this.checkBusinessPlan(userId);
    return this.prisma.portfolio.update({
      where: { userId },
      data,
    });
  }

  // ─── Bookings ───────────────────────────────────────────

  async getBookings(userId: string, status?: string) {
    await this.checkBusinessPlan(userId);
    return this.prisma.booking.findMany({
      where: {
        userId,
        ...(status && { status: status as any }),
      },
      orderBy: { bookedAt: 'asc' },
    });
  }

  async updateBookingStatus(userId: string, id: string, status: string) {
    await this.checkBusinessPlan(userId);
    const booking = await this.prisma.booking.findFirst({
      where: { id, userId },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    return this.prisma.booking.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async deleteBooking(userId: string, id: string) {
    await this.checkBusinessPlan(userId);
    const booking = await this.prisma.booking.findFirst({
      where: { id, userId },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return this.prisma.booking.delete({ where: { id } });
  }

  // ─── Public ─────────────────────────────────────────────

  async getPublicAvailability(username: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { username, published: true },
      include: { availability: { orderBy: { dayOfWeek: 'asc' } } },
    });
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    if (!portfolio.bookingEnabled)
      throw new BadRequestException('Booking is not enabled');

    return {
      bookingEnabled: portfolio.bookingEnabled,
      bookingDuration: portfolio.bookingDuration ?? 60,
      bookingBuffer: portfolio.bookingBuffer ?? 0,
      availability: portfolio.availability,
    };
  }

  async getAvailableSlots(username: string, date: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { username, published: true },
      include: { availability: true },
    });
    if (!portfolio || !portfolio.bookingEnabled) {
      throw new BadRequestException('Booking not available');
    }

    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();

    const dayAvailability = portfolio.availability.find(
      (a) => a.dayOfWeek === dayOfWeek && a.isActive,
    );
    if (!dayAvailability) return { slots: [] };

    const duration = portfolio.bookingDuration ?? 60;
    const buffer = portfolio.bookingBuffer ?? 0;

    // Generate slots
    const slots: string[] = [];
    const [startH, startM] = dayAvailability.startTime.split(':').map(Number);
    const [endH, endM] = dayAvailability.endTime.split(':').map(Number);

    let current = startH * 60 + startM;
    const end = endH * 60 + endM;

    // Get existing bookings for this date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await this.prisma.booking.findMany({
      where: {
        userId: portfolio.userId,
        bookedAt: { gte: startOfDay, lte: endOfDay },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    while (current + duration <= end) {
      const hours = Math.floor(current / 60)
        .toString()
        .padStart(2, '0');
      const minutes = (current % 60).toString().padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;

      // Check if slot is taken
      const slotStart = new Date(date);
      slotStart.setHours(Math.floor(current / 60), current % 60, 0, 0);

      const isTaken = existingBookings.some((booking) => {
        const bookingTime = new Date(booking.bookedAt);
        return (
          Math.abs(bookingTime.getTime() - slotStart.getTime()) <
          duration * 60 * 1000
        );
      });

      if (!isTaken) slots.push(timeStr);
      current += duration + buffer;
    }

    return { slots, duration, date };
  }

  // async createBooking(username: string, data: {
  //   clientName: string
  //   clientEmail: string
  //   clientPhone?: string
  //   date: string
  //   time: string
  //   notes?: string
  // }) {
  //   const portfolio = await this.prisma.portfolio.findUnique({
  //     where: { username, published: true },
  //   })
  //   if (!portfolio || !portfolio.bookingEnabled) {
  //     throw new BadRequestException('Booking not available')
  //   }

  //   const [hours, minutes] = data.time.split(':').map(Number)
  //   const bookedAt = new Date(data.date)
  //   bookedAt.setHours(hours, minutes, 0, 0)

  //   if (bookedAt < new Date()) {
  //     throw new BadRequestException('Cannot book in the past')
  //   }

  //   return this.prisma.booking.create({
  //     data: {
  //       userId: portfolio.userId,
  //       clientName: data.clientName,
  //       clientEmail: data.clientEmail,
  //       clientPhone: data.clientPhone,
  //       bookedAt,
  //       durationMinutes: portfolio.bookingDuration ?? 60,
  //       notes: data.notes,
  //       status: 'PENDING',
  //     },
  //   })
  // }
  async createBooking(
    username: string,
    data: {
      clientName: string;
      clientEmail: string;
      clientPhone?: string;
      date: string;
      time: string;
      notes?: string;
    },
  ) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { username, published: true },
      include: { user: true }, // ← أضف include
    });
    if (!portfolio || !portfolio.bookingEnabled) {
      throw new BadRequestException('Booking not available');
    }

    const [hours, minutes] = data.time.split(':').map(Number);
    const bookedAt = new Date(data.date);
    bookedAt.setHours(hours, minutes, 0, 0);

    if (bookedAt < new Date()) {
      throw new BadRequestException('Cannot book in the past');
    }

    const booking = await this.prisma.booking.create({
      data: {
        userId: portfolio.userId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        bookedAt,
        durationMinutes: portfolio.bookingDuration ?? 60,
        notes: data.notes,
        status: 'PENDING',
      },
    });

    // Telegram notification لصاحب البورتفوليو
    const ownerChatId = portfolio.user?.telegramChatId;
    if (ownerChatId) {
      const botToken = this.config.get('TELEGRAM_BOT_TOKEN');
      const message = `
📅 <b>New Booking Request!</b>

👤 <b>Client:</b> ${data.clientName}
📧 <b>Email:</b> ${data.clientEmail}
${data.clientPhone ? `📞 <b>Phone:</b> ${data.clientPhone}` : ''}
🕐 <b>Date:</b> ${new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
⏰ <b>Time:</b> ${data.time} · ${portfolio.bookingDuration ?? 60} min
${data.notes ? `📝 <b>Notes:</b> ${data.notes}` : ''}

→ Go to dashboard to confirm or cancel
    `.trim();

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: ownerChatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }).catch(() => {});
    }

    return booking;
  }
}

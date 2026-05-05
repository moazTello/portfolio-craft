import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async trackEvent(
    portfolioId: string,
    data: {
      eventType: string;
      section?: string;
      referrer?: string;
      country?: string;
    },
  ) {
    return this.prisma.analyticsEvent.create({
      data: {
        portfolioId,
        eventType: data.eventType,
        section: data.section,
        referrer: data.referrer,
        country: data.country,
      },
    });
  }

  async getSummary(userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { userId },
    });
    if (!portfolio) return null;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalViews, totalClicks, topSections, recentViews] =
      await Promise.all([
        // Total views
        this.prisma.analyticsEvent.count({
          where: { portfolioId: portfolio.id, eventType: 'page_view' },
        }),

        // Total contact clicks
        this.prisma.analyticsEvent.count({
          where: { portfolioId: portfolio.id, eventType: 'contact_click' },
        }),

        // Top sections
        this.prisma.analyticsEvent.groupBy({
          by: ['section'],
          where: { portfolioId: portfolio.id, section: { not: null } },
          _count: { section: true },
          orderBy: { _count: { section: 'desc' } },
          take: 5,
        }),

        // Views last 30 days
        this.prisma.analyticsEvent.count({
          where: {
            portfolioId: portfolio.id,
            eventType: 'page_view',
            occurredAt: { gte: thirtyDaysAgo },
          },
        }),
      ]);

    return {
      totalViews,
      totalClicks,
      recentViews,
      topSections,
    };
  }

  // async getTimeseries(userId: string) {
  //   const portfolio = await this.prisma.portfolio.findUnique({
  //     where: { userId },
  //   });
  //   if (!portfolio) return [];

  //   const thirtyDaysAgo = new Date();
  //   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  //   const events = await this.prisma.analyticsEvent.findMany({
  //     where: {
  //       portfolioId: portfolio.id,
  //       eventType: 'page_view',
  //       occurredAt: { gte: thirtyDaysAgo },
  //     },
  //     select: { occurredAt: true },
  //     orderBy: { occurredAt: 'asc' },
  //   });

  //   // Group by day
  //   const grouped: Record<string, number> = {};
  //   events.forEach((event) => {
  //     const day = event.occurredAt.toISOString().split('T')[0];
  //     grouped[day] = (grouped[day] ?? 0) + 1;
  //   });

  //   // Fill missing days
  //   const result: { date: string; views: number }[] = [];
  //   for (let i = 29; i >= 0; i--) {
  //     const date = new Date();
  //     date.setDate(date.getDate() - i);
  //     const day = date.toISOString().split('T')[0];
  //     result.push({ date: day, views: grouped[day] ?? 0 });
  //   }

  //   return result;
  // }
//   async getTimeseries(userId: string) {
//   const portfolio = await this.prisma.portfolio.findUnique({ where: { userId } })
//   if (!portfolio) return []

//   const thirtyDaysAgo = new Date()
//   thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

//   const events = await this.prisma.analyticsEvent.findMany({
//     where: {
//       portfolioId: portfolio.id,
//       eventType: 'page_view',
//       occurredAt: { gte: thirtyDaysAgo },
//     },
//     select: { occurredAt: true },
//     orderBy: { occurredAt: 'asc' },
//   })

//   // Group by day using local date string
//   const grouped: Record<string, number> = {}
//   events.forEach(event => {
//     // استخدم toISOString بس خذ الـ date part بس
//     const day = event.occurredAt.toISOString().split('T')[0]
//     grouped[day] = (grouped[day] ?? 0) + 1
//   })

//   // Fill missing days
//   const result: { date: string; views: number }[] = []
//   for (let i = 29; i >= 0; i--) {
//     const date = new Date()
//     date.setDate(date.getDate() - i)
//     const day = date.toISOString().split('T')[0]
//     result.push({ date: day, views: grouped[day] ?? 0 })
//   }

//   return result
// }
async getTimeseries(userId: string) {
  const portfolio = await this.prisma.portfolio.findUnique({ where: { userId } })
  if (!portfolio) return []

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  thirtyDaysAgo.setHours(0, 0, 0, 0)

  const events = await this.prisma.analyticsEvent.findMany({
    where: {
      portfolioId: portfolio.id,
      eventType: 'page_view',
      occurredAt: { gte: thirtyDaysAgo },
    },
    select: { occurredAt: true },
  })

  console.log('Total events found:', events.length)

  // Group by day
  const grouped: Record<string, number> = {}
  events.forEach(event => {
    const d = new Date(event.occurredAt)
    const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    grouped[day] = (grouped[day] ?? 0) + 1
  })

  console.log('Grouped:', grouped)

  // Fill 30 days
  const result: { date: string; views: number }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    result.push({ date: day, views: grouped[day] ?? 0 })
  }

  return result
}
}

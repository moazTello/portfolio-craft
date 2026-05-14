import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class PortfolioService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async create(userId: string) {
    const existing = await this.prisma.portfolio.findUnique({
      where: { userId },
    });
    if (existing) throw new ConflictException('Portfolio already exists');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const baseUsername = user!.email
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
    const username = await this.uniqueUsername(baseUsername);

    return this.prisma.portfolio.create({
      data: { userId, username },
    });
  }

  async findMine(userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { userId },
      include: {
        projects: { orderBy: { displayOrder: 'asc' } },
        skills: { orderBy: { displayOrder: 'asc' } },
        experiences: { orderBy: { displayOrder: 'asc' } },
        certificates: { orderBy: { displayOrder: 'asc' } },
        testimonials: { orderBy: { displayOrder: 'asc' } },
        services: { orderBy: { displayOrder: 'asc' } },
      },
    });
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    return portfolio;
  }

  // async update(userId: string, dto: UpdatePortfolioDto) {
  //   return this.prisma.portfolio.update({
  //     where: { userId },
  //     data: dto,
  //   });
  // }

  //   async update(userId: string, data: any) {
  //   const portfolio = await this.prisma.portfolio.findUnique({ where: { userId } })
  //   if (!portfolio) throw new NotFoundException('Portfolio not found')

  //   const user = await this.prisma.user.findUnique({ where: { id: userId } })

  //   // تحقق من الثيم حسب الخطة
  //   if (data.themePreset) {
  //     const proThemes = ['default', 'midnight', 'forest', 'ocean', 'rose', 'slate']
  //     const businessThemes = ['sunset', 'obsidian', 'aurora', 'luxury', 'neon', 'arctic']

  //     if (businessThemes.includes(data.themePreset) && user?.plan !== 'BUSINESS') {
  //       throw new ForbiddenException('This theme is available on Business plan only')
  //     }
  //     if (!proThemes.includes(data.themePreset) && !businessThemes.includes(data.themePreset)) {
  //       throw new ForbiddenException('Invalid theme')
  //     }
  //   }

  //   return this.prisma.portfolio.update({
  //     where: { userId },
  //     data,
  //   })
  // }
  async update(userId: string, data: any) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { userId },
    });
    if (!portfolio) throw new NotFoundException('Portfolio not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    // تحقق من الثيم حسب الخطة
    if (data.themePreset) {
      const proThemes = [
        'default',
        'midnight',
        'forest',
        'ocean',
        'rose',
        'slate',
      ];
      const businessThemes = [
        'sunset',
        'obsidian',
        'aurora',
        'luxury',
        'neon',
        'arctic',
      ];

      if (
        businessThemes.includes(data.themePreset) &&
        user?.plan !== 'BUSINESS'
      ) {
        throw new ForbiddenException(
          'This theme is available on Business plan only',
        );
      }
      if (
        !proThemes.includes(data.themePreset) &&
        !businessThemes.includes(data.themePreset)
      ) {
        throw new ForbiddenException('Invalid theme');
      }
    }

    return this.prisma.portfolio.update({
      where: { userId },
      data,
    });
  }

  async updateUsername(userId: string, username: string) {
    // تحقق إن الـ username صالح
    const valid = /^[a-z0-9_-]{3,30}$/.test(username);
    if (!valid) {
      throw new BadRequestException(
        'Username must be 3-30 characters, lowercase letters, numbers, _ or - only',
      );
    }

    // تحقق إنه مو مأخوذ
    const existing = await this.prisma.portfolio.findUnique({
      where: { username },
    });
    if (existing && existing.userId !== userId) {
      throw new ConflictException('Username already taken');
    }

    return this.prisma.portfolio.update({
      where: { userId },
      data: { username },
    });
  }
  async setPublished(userId: string, published: boolean) {
    return this.prisma.portfolio.update({
      where: { userId },
      data: { published },
    });
  }
  async findPublic(username: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { username, published: true },
      include: {
        user: {
          select: { avatarUrl: true },
        },
        projects: { orderBy: { displayOrder: 'asc' } },
        skills: { orderBy: { displayOrder: 'asc' } },
        experiences: { orderBy: { displayOrder: 'asc' } },
        certificates: { orderBy: { displayOrder: 'asc' } },
        testimonials: { orderBy: { displayOrder: 'asc' } },
        services: { orderBy: { displayOrder: 'asc' } },
        gallery: { orderBy: { displayOrder: 'asc' } },
        clients: { orderBy: { displayOrder: 'asc' } },
        achievements: { orderBy: { displayOrder: 'asc' } },
      },
    });
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    const blogPosts = await this.prisma.blogPost.findMany({
      where: { userId: portfolio.userId, published: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        readTime: true,
        tags: true,
        publishedAt: true,
      },
    });
    return { ...portfolio, blogPosts };
  }
  private async uniqueUsername(base: string): Promise<string> {
    let username = base;
    let i = 1;
    while (await this.prisma.portfolio.findUnique({ where: { username } })) {
      username = `${base}${i++}`;
    }
    return username;
  }
  private async removeDomainFromVercel(domain: string) {
    try {
      const token = this.config.get('VERCEL_TOKEN');
      const projectId = this.config.get('VERCEL_PROJECT_ID');

      await fetch(
        `https://api.vercel.com/v9/projects/${projectId}/domains/${domain}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (e) {
      console.error('Vercel domain remove error:', e);
    }
  }
  private async addDomainToVercel(domain: string) {
    try {
      const token = this.config.get('VERCEL_TOKEN');
      const projectId = this.config.get('VERCEL_PROJECT_ID');

      await fetch(`https://api.vercel.com/v9/projects/${projectId}/domains`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: domain }),
      });
    } catch (e) {
      console.error('Vercel domain add error:', e);
    }
  }
  async setCustomDomain(userId: string, domain: string | null) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.plan === 'FREE') {
      throw new ForbiddenException(
        'Custom domain is available on Pro and Business plans only',
      );
    }

    if (domain) {
      // تنظيف الدومين أول
      const cleanDomain = domain
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, '')
        .trim();

      // تحقق من الصيغة
      const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/;
      if (!domainRegex.test(cleanDomain)) {
        throw new BadRequestException('Invalid domain format');
      }

      // تحقق إنه مو مأخوذ
      const existing = await this.prisma.portfolio.findFirst({
        where: { customDomain: cleanDomain, NOT: { userId } },
      });
      if (existing) {
        throw new ConflictException('Domain already in use');
      }
      await this.addDomainToVercel(cleanDomain);
      return this.prisma.portfolio.update({
        where: { userId },
        data: { customDomain: cleanDomain },
      });
    }

    if (!domain) {
      const portfolio = await this.prisma.portfolio.findUnique({
        where: { userId },
      });
      if (portfolio?.customDomain) {
        await this.removeDomainFromVercel(portfolio.customDomain);
      }
      return this.prisma.portfolio.update({
        where: { userId },
        data: { customDomain: null },
      });
    }

    // حذف الدومين
    return this.prisma.portfolio.update({
      where: { userId },
      data: { customDomain: null },
    });
  }

  async verifyDomain(userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { userId },
    });
    if (!portfolio?.customDomain) {
      throw new BadRequestException('No custom domain set');
    }

    try {
      const dns = await import('dns').then((m) => m.promises);
      const records = await dns.resolveCname(portfolio.customDomain);
      const pointsToUs = records.some(
        (r) =>
          r.includes('portfolio-craft.com') ||
          r.includes('portfoliocraft.com') ||
          r.includes('vercel.app') ||
          r.includes('vercel-dns.com') ||
          r.includes('vercel-dns-'), // ← أضف هذا
      );

      return {
        verified: pointsToUs,
        domain: portfolio.customDomain,
        cname: records[0] ?? null,
      };
    } catch {
      // إذا ما قدر يحل الـ DNS — جرب HTTP check
      try {
        const res = await fetch(`https://${portfolio.customDomain}`, {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000),
        });
        return {
          verified: res.ok,
          domain: portfolio.customDomain,
          cname: null,
        };
      } catch {
        return {
          verified: false,
          domain: portfolio.customDomain,
          cname: null,
        };
      }
    }
  }

  async findByDomain(domain: string) {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { customDomain: domain, published: true },
      select: { username: true },
    });
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    return portfolio;
  }
}

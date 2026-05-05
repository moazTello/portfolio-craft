import { PrismaService } from '../../database/prisma.service';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
const PLAN_LIMITS = {
  FREE: 0,
  PRO: 5,
  BUSINESS: Infinity,
};
@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}
  private async getPortfolio(userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { userId },
    });
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    return portfolio;
  }

  async findAll(userId: string) {
    const portfolio = await this.getPortfolio(userId);
    return this.prisma.service.findMany({
      where: { portfolioId: portfolio.id },
      orderBy: { displayOrder: 'asc' },
    });
  }

  //   async create(userId: string, data: {
  //     title: string
  //     description?: string
  //     iconUrl?: string
  //     price?: string
  //     featured?: boolean
  //   }) {
  //     const portfolio = await this.getPortfolio(userId)
  //     const count = await this.prisma.service.count({ where: { portfolioId: portfolio.id } })
  //     return this.prisma.service.create({
  //       data: { portfolioId: portfolio.id, displayOrder: count, ...data },
  //     })
  //   }

  async create(userId: string, data: any) {
    const portfolio = await this.getPortfolio(userId);
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const limit = PLAN_LIMITS[user?.plan ?? 'FREE'];

    if (limit === 0) {
      throw new ForbiddenException(
        'Services are available on Pro and Business plans only',
      );
    }

    const count = await this.prisma.service.count({
      where: { portfolioId: portfolio.id },
    });

    if (count >= limit) {
      throw new ForbiddenException(
        `Your Pro plan allows up to ${limit} services. Upgrade to Business for unlimited.`,
      );
    }

    // Business only — price و featured
    const cleanData = { ...data };
    if (user?.plan !== 'BUSINESS') {
      delete cleanData.price;
      delete cleanData.featured;
    }

    return this.prisma.service.create({
      data: { portfolioId: portfolio.id, displayOrder: count, ...cleanData },
    });
  }

  async update(
    userId: string,
    id: string,
    data: {
      title?: string;
      description?: string;
      iconUrl?: string;
      price?: string;
      featured?: boolean;
    },
  ) {
    const portfolio = await this.getPortfolio(userId);
    return this.prisma.service.update({
      where: { id, portfolioId: portfolio.id },
      data,
    });
  }

  async delete(userId: string, id: string) {
    const portfolio = await this.getPortfolio(userId);
    return this.prisma.service.delete({
      where: { id, portfolioId: portfolio.id },
    });
  }
}

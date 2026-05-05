import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'

const PLAN_LIMITS = {
  FREE: 6,
  PRO: 30,
  BUSINESS: Infinity,
}

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  private async getPortfolioAndUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    const portfolio = await this.prisma.portfolio.findUnique({ where: { userId } })
    if (!portfolio) throw new NotFoundException('Portfolio not found')
    return { portfolio, user }
  }

  async findAll(userId: string) {
    const { portfolio } = await this.getPortfolioAndUser(userId)
    return this.prisma.galleryImage.findMany({
      where: { portfolioId: portfolio.id },
      orderBy: { displayOrder: 'asc' },
    })
  }

  async findPublic(portfolioId: string) {
    return this.prisma.galleryImage.findMany({
      where: { portfolioId },
      orderBy: { displayOrder: 'asc' },
    })
  }

  async create(userId: string, data: { imageUrl: string; caption?: string; category?: string }) {
    const { portfolio, user } = await this.getPortfolioAndUser(userId)

    // Check plan limit
    const limit = PLAN_LIMITS[user?.plan ?? 'FREE']
    const count = await this.prisma.galleryImage.count({
      where: { portfolioId: portfolio.id },
    })

    if (count >= limit) {
      throw new ForbiddenException(
        `Your ${user?.plan} plan allows up to ${limit === Infinity ? 'unlimited' : limit} images. Upgrade to add more.`
      )
    }

    return this.prisma.galleryImage.create({
      data: { portfolioId: portfolio.id, ...data },
    })
  }

  async update(userId: string, id: string, data: { caption?: string; category?: string }) {
    const { portfolio } = await this.getPortfolioAndUser(userId)
    return this.prisma.galleryImage.update({
      where: { id, portfolioId: portfolio.id },
      data,
    })
  }

  async delete(userId: string, id: string) {
    const { portfolio } = await this.getPortfolioAndUser(userId)
    return this.prisma.galleryImage.delete({
      where: { id, portfolioId: portfolio.id },
    })
  }

  async reorder(userId: string, ids: string[]) {
    const { portfolio } = await this.getPortfolioAndUser(userId)
    await Promise.all(
      ids.map((id, index) =>
        this.prisma.galleryImage.update({
          where: { id, portfolioId: portfolio.id },
          data: { displayOrder: index },
        })
      )
    )
    return { success: true }
  }

  async getStats(userId: string) {
    const { portfolio, user } = await this.getPortfolioAndUser(userId)
    const count = await this.prisma.galleryImage.count({
      where: { portfolioId: portfolio.id },
    })
    const limit = PLAN_LIMITS[user?.plan ?? 'FREE']
    return {
      count,
      limit: limit === Infinity ? null : limit,
      plan: user?.plan,
      canAdd: count < limit,
    }
  }
}
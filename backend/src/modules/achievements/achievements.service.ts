import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class AchievementsService {
  constructor(private prisma: PrismaService) {}

  private async getPortfolio(userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({ where: { userId } })
    if (!portfolio) throw new NotFoundException('Portfolio not found')
    return portfolio
  }

  async findAll(userId: string) {
    const portfolio = await this.getPortfolio(userId)
    return this.prisma.achievement.findMany({
      where: { portfolioId: portfolio.id },
      orderBy: { displayOrder: 'asc' },
    })
  }

  async create(userId: string, data: {
    title: string
    description?: string
    date?: string
  }) {
    const portfolio = await this.getPortfolio(userId)
    const count = await this.prisma.achievement.count({ where: { portfolioId: portfolio.id } })
    return this.prisma.achievement.create({
      data: {
        portfolioId: portfolio.id,
        displayOrder: count,
        title: data.title,
        description: data.description,
        date: data.date ? new Date(data.date) : undefined,
      },
    })
  }

  async update(userId: string, id: string, data: {
    title?: string
    description?: string
    date?: string
  }) {
    const portfolio = await this.getPortfolio(userId)
    return this.prisma.achievement.update({
      where: { id, portfolioId: portfolio.id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    })
  }

  async delete(userId: string, id: string) {
    const portfolio = await this.getPortfolio(userId)
    return this.prisma.achievement.delete({
      where: { id, portfolioId: portfolio.id },
    })
  }
}
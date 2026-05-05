import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  private async getPortfolio(userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({ where: { userId } })
    if (!portfolio) throw new NotFoundException('Portfolio not found')
    return portfolio
  }

  async findAll(userId: string) {
    const portfolio = await this.getPortfolio(userId)
    return this.prisma.client.findMany({
      where: { portfolioId: portfolio.id },
      orderBy: { displayOrder: 'asc' },
    })
  }

  async create(userId: string, data: { name: string; logoUrl?: string; websiteUrl?: string }) {
    const portfolio = await this.getPortfolio(userId)
    const count = await this.prisma.client.count({ where: { portfolioId: portfolio.id } })
    return this.prisma.client.create({
      data: { portfolioId: portfolio.id, displayOrder: count, ...data },
    })
  }

  async update(userId: string, id: string, data: { name?: string; logoUrl?: string; websiteUrl?: string }) {
    const portfolio = await this.getPortfolio(userId)
    return this.prisma.client.update({
      where: { id, portfolioId: portfolio.id },
      data,
    })
  }

  async delete(userId: string, id: string) {
    const portfolio = await this.getPortfolio(userId)
    return this.prisma.client.delete({
      where: { id, portfolioId: portfolio.id },
    })
  }
}
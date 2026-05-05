import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import { CreateSkillDto } from './dto/skill.dto'

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  private async getPortfolioId(userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({ where: { userId } })
    if (!portfolio) throw new NotFoundException('Portfolio not found')
    return portfolio.id
  }

  async findAll(userId: string) {
    const portfolioId = await this.getPortfolioId(userId)
    return this.prisma.skill.findMany({
      where: { portfolioId },
      orderBy: { displayOrder: 'asc' },
    })
  }

  async create(userId: string, dto: CreateSkillDto) {
    const portfolioId = await this.getPortfolioId(userId)
    return this.prisma.skill.create({
      data: { portfolioId, ...dto },
    })
  }

  async update(userId: string, id: string, dto: CreateSkillDto) {
    const portfolioId = await this.getPortfolioId(userId)
    return this.prisma.skill.update({
      where: { id, portfolioId },
      data: dto,
    })
  }

  async remove(userId: string, id: string) {
    const portfolioId = await this.getPortfolioId(userId)
    return this.prisma.skill.delete({
      where: { id, portfolioId },
    })
  }
}
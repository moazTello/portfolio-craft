import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import { CreateProjectDto } from './dto/project.dto'

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  private async getPortfolioId(userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({ where: { userId } })
    if (!portfolio) throw new NotFoundException('Portfolio not found')
    return portfolio.id
  }

  async findAll(userId: string) {
    const portfolioId = await this.getPortfolioId(userId)
    return this.prisma.project.findMany({
      where: { portfolioId },
      orderBy: { displayOrder: 'asc' },
    })
  }

  async create(userId: string, dto: CreateProjectDto) {
    const portfolioId = await this.getPortfolioId(userId)
    return this.prisma.project.create({
      data: { portfolioId, ...dto },
    })
  }

  async update(userId: string, id: string, dto: CreateProjectDto) {
    const portfolioId = await this.getPortfolioId(userId)
    return this.prisma.project.update({
      where: { id, portfolioId },
      data: dto,
    })
  }

  async remove(userId: string, id: string) {
    const portfolioId = await this.getPortfolioId(userId)
    return this.prisma.project.delete({
      where: { id, portfolioId },
    })
  }
}
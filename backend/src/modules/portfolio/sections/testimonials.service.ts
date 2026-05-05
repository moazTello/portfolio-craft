import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import { CreateTestimonialDto } from './dto/testimonial.dto'

@Injectable()
export class TestimonialsService {
  constructor(private prisma: PrismaService) {}

  private async getPortfolioId(userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({ where: { userId } })
    if (!portfolio) throw new NotFoundException('Portfolio not found')
    return portfolio.id
  }

  async findAll(userId: string) {
    const portfolioId = await this.getPortfolioId(userId)
    return this.prisma.testimonial.findMany({
      where: { portfolioId },
      orderBy: { displayOrder: 'asc' },
    })
  }

  async create(userId: string, dto: CreateTestimonialDto) {
    const portfolioId = await this.getPortfolioId(userId)
    return this.prisma.testimonial.create({
      data: { portfolioId, ...dto },
    })
  }

  async update(userId: string, id: string, dto: CreateTestimonialDto) {
    const portfolioId = await this.getPortfolioId(userId)
    return this.prisma.testimonial.update({
      where: { id, portfolioId },
      data: dto,
    })
  }

  async remove(userId: string, id: string) {
    const portfolioId = await this.getPortfolioId(userId)
    return this.prisma.testimonial.delete({
      where: { id, portfolioId },
    })
  }
}
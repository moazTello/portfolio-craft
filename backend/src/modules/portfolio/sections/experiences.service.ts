import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateExperienceDto } from './dto/experience.dto';

@Injectable()
export class ExperiencesService {
  constructor(private prisma: PrismaService) {}

  private async getPortfolioId(userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { userId },
    });
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    return portfolio.id;
  }

  async findAll(userId: string) {
    const portfolioId = await this.getPortfolioId(userId);
    return this.prisma.experience.findMany({
      where: { portfolioId },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async create(userId: string, dto: CreateExperienceDto) {
    const portfolioId = await this.getPortfolioId(userId);
    return this.prisma.experience.create({
      data: {
        portfolioId,
        company: dto.company,
        role: dto.role,
        location: dto.location,
        description: dto.description,
        current: dto.current ?? false,
        startDate: dto.startDate ? new Date(dto.startDate) : new Date(),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  async update(userId: string, id: string, dto: CreateExperienceDto) {
    const portfolioId = await this.getPortfolioId(userId);
    return this.prisma.experience.update({
      where: { id, portfolioId },
      data: {
        company: dto.company,
        role: dto.role,
        location: dto.location,
        description: dto.description,
        current: dto.current ?? false,
        startDate: dto.startDate ? new Date(dto.startDate) : new Date(),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });
  }

  async remove(userId: string, id: string) {
    const portfolioId = await this.getPortfolioId(userId);
    return this.prisma.experience.delete({
      where: { id, portfolioId },
    });
  }
}

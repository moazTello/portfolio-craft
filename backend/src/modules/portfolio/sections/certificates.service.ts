import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../../database/prisma.service'
import { CreateCertificateDto } from './dto/certificate.dto'

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  private async getPortfolioId(userId: string) {
    const portfolio = await this.prisma.portfolio.findUnique({ where: { userId } })
    if (!portfolio) throw new NotFoundException('Portfolio not found')
    return portfolio.id
  }

  async findAll(userId: string) {
    const portfolioId = await this.getPortfolioId(userId)
    return this.prisma.certificate.findMany({
      where: { portfolioId },
      orderBy: { displayOrder: 'asc' },
    })
  }

  async create(userId: string, dto: CreateCertificateDto) {
    const portfolioId = await this.getPortfolioId(userId)
    return this.prisma.certificate.create({
      data: {
        portfolioId,
        title: dto.title,
        issuer: dto.issuer,
        credentialUrl: dto.credentialUrl,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : new Date(),
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
      },
    })
  }

  async update(userId: string, id: string, dto: CreateCertificateDto) {
    const portfolioId = await this.getPortfolioId(userId)
    return this.prisma.certificate.update({
      where: { id, portfolioId },
      data: {
        title: dto.title,
        issuer: dto.issuer,
        credentialUrl: dto.credentialUrl,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
      },
    })
  }

  async remove(userId: string, id: string) {
    const portfolioId = await this.getPortfolioId(userId)
    return this.prisma.certificate.delete({
      where: { id, portfolioId },
    })
  }
}
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { UploadService } from '../../common/services/upload.service'

@Injectable()
export class ClientsService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

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

    // ارفع اللوغو على Cloudinary
    let logoUrl = data.logoUrl
    if (data.logoUrl?.startsWith('data:')) {
      logoUrl = await this.uploadService.uploadImage(
        data.logoUrl,
        'portfoliocraft/clients'
      )
    }

    return this.prisma.client.create({
      data: { portfolioId: portfolio.id, displayOrder: count, ...data, logoUrl },
    })
  }

  async update(userId: string, id: string, data: { name?: string; logoUrl?: string; websiteUrl?: string }) {
    const portfolio = await this.getPortfolio(userId)

    // ارفع اللوغو الجديد على Cloudinary
    let logoUrl = data.logoUrl
    if (data.logoUrl?.startsWith('data:')) {
      // احذف القديم
      const old = await this.prisma.client.findUnique({ where: { id } })
      if (old?.logoUrl) await this.uploadService.deleteImage(old.logoUrl)

      // ارفع الجديد
      logoUrl = await this.uploadService.uploadImage(
        data.logoUrl,
        'portfoliocraft/clients'
      )
    }

    return this.prisma.client.update({
      where: { id, portfolioId: portfolio.id },
      data: { ...data, ...(logoUrl && { logoUrl }) },
    })
  }

  async delete(userId: string, id: string) {
    const portfolio = await this.getPortfolio(userId)

    // احذف اللوغو من Cloudinary
    const client = await this.prisma.client.findUnique({ where: { id } })
    if (client?.logoUrl) await this.uploadService.deleteImage(client.logoUrl)

    return this.prisma.client.delete({
      where: { id, portfolioId: portfolio.id },
    })
  }
}
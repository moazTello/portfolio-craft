import { Controller, Post, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Export')
@Controller('export')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExportController {
  constructor(private readonly exportService: ExportService) {}
  //هي بدها ميموري بالباك
  // @Post('pdf')
  // @ApiOperation({ summary: 'Export portfolio as PDF (Business plan only)' })
  // async exportPdf(@CurrentUser() user: any, @Res() res: Response) {
  //   try {
  //     const pdf = await this.exportService.exportPdf(user.id)
  //     res.setHeader('Content-Type', 'application/pdf')
  //     res.setHeader('Content-Disposition', 'attachment; filename=portfolio.pdf')
  //     res.send(pdf)
  //   } catch (err: any) {
  //     res.status(err.status ?? 500).json({ message: err.message })
  //   }
  // }

  //   @Post('pdf')
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // async exportPdf(@CurrentUser() user: any, @Res() res: Response) {
  //   const portfolio = await this.prisma.portfolio.findUnique({
  //     where: { userId: user.id },
  //     select: { username: true, pdfTemplate: true, plan: true }
  //   })

  //   if (!portfolio) throw new NotFoundException('Portfolio not found')

  //   const template = portfolio.pdfTemplate ?? 'modern'
  //   const frontendUrl = this.config.get('FRONTEND_URL')
  //   const printUrl = `${frontendUrl}/${portfolio.username}/print/${template}`

  //   return res.json({ printUrl })
  // }
  @Post('pdf')
  @ApiOperation({ summary: 'Get PDF print URL' })
  async exportPdf(@CurrentUser() user: any) {
    return this.exportService.getPrintUrl(user.id);
  }
}

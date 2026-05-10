import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import puppeteer from 'puppeteer';

@Injectable()
export class ExportService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  //   async exportPdf(userId: string) {
  //     // تحقق من الخطة
  //     const user = await this.prisma.user.findUnique({ where: { id: userId } });
  //     if (user?.plan !== 'BUSINESS') {
  //       throw new ForbiddenException(
  //         'PDF export is available on Business plan only',
  //       );
  //     }

  //     // جيب الـ username
  //     const portfolio = await this.prisma.portfolio.findUnique({
  //       where: { userId },
  //     });
  //     if (!portfolio) throw new ForbiddenException('Portfolio not found');

  //     const frontendUrl = this.config.get('FRONTEND_URL');
  //     const url = `${frontendUrl}/${portfolio.username}?mode=print`;

  //     // شغّل Puppeteer
  //     const browser = await puppeteer.launch({
  //       headless: true,
  //       args: ['--no-sandbox', '--disable-setuid-sandbox'],
  //     });

  //     try {
  //       const page = await browser.newPage();
  //       await page.setViewport({ width: 1200, height: 800 });
  //       await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  //       // انتظر تحميل الصور والـ animations
  //       await new Promise((resolve) => setTimeout(resolve, 2000));

  //       const pdf = await page.pdf({
  //         format: 'A4',
  //         printBackground: true,
  //         margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
  //       });

  //       return pdf;
  //     } finally {
  //       await browser.close();
  //     }
  //   }

  async getPrintUrl(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.plan !== 'BUSINESS') {
      throw new ForbiddenException(
        'PDF export is available on Business plan only',
      );
    }

    const portfolio = await this.prisma.portfolio.findUnique({
      where: { userId },
      select: { username: true, pdfTemplate: true },
    });
    if (!portfolio) throw new NotFoundException('Portfolio not found');

    const template = portfolio.pdfTemplate ?? 'modern';
    const frontendUrl = this.config.get('FRONTEND_URL');
    return {
      printUrl: `${frontendUrl}/${portfolio.username}/print/${template}`,
    };
  }
  async exportPdf(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.plan !== 'BUSINESS') {
      throw new ForbiddenException(
        'PDF export is available on Business plan only',
      );
    }

    const portfolio = await this.prisma.portfolio.findUnique({
      where: { userId },
    });
    if (!portfolio) throw new ForbiddenException('Portfolio not found');
    const template = portfolio.pdfTemplate ?? 'modern';
    const url = `${this.config.get('FRONTEND_URL')}/${portfolio.username}/print/${template}`;

    const browser = await puppeteer.launch({
      headless: true,
      executablePath:
        process.env.PUPPETEER_EXECUTABLE_PATH ?? '/usr/bin/chromium-browser',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
      ],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', bottom: '0', left: '0', right: '0' },
      });

      return pdf;
    } finally {
      await browser.close();
    }
  }
}

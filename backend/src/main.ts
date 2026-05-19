import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ limit: '2mb', extended: true }));
  app.setGlobalPrefix('v1', {
    exclude: ['api', 'api-json'],
  });

  // app.enableCors({
  //   origin: ['http://localhost:3000'],
  //   credentials: true,
  // });
  // app.enableCors({
  //   origin: [
  //     'http://localhost:3000',
  //     'https://portfolio-craft-pearl.vercel.app',
  //     process.env.FRONTEND_URL ?? '',
  //   ],
  //   credentials: true,
  // });
  // app.enableCors({
  //   origin: (origin, callback) => {
  //     const allowed = [
  //       'http://localhost:3000',
  //       'https://portfolio-craft.com',
  //       'https://www.portfolio-craft.com',
  //       process.env.FRONTEND_URL ?? '',
  //     ];
  //     // اقبل كل vercel.app subdomains
  //     if (
  //       !origin ||
  //       allowed.includes(origin) ||
  //       origin.endsWith('.vercel.app')
  //     ) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error('Not allowed by CORS'));
  //     }
  //   },
  //   credentials: true,
  // });

  // app.enableCors({
  //   origin: async (origin, callback) => {
  //     if (!origin) return callback(null, true);

  //     const allowed = [
  //       'http://localhost:3000',
  //       'https://portfolio-craft.com',
  //       'https://www.portfolio-craft.com',
  //       process.env.FRONTEND_URL ?? '',
  //     ];

  //     // اقبل كل vercel.app subdomains
  //     if (allowed.includes(origin) || origin.endsWith('.vercel.app')) {
  //       return callback(null, true);
  //     }

  //     // تحقق إذا الدومين مسجل كـ custom domain
  //     try {
  //       const { PrismaClient } = await import('@prisma/client');
  //       const prisma = new PrismaClient();
  //       const domain = origin
  //         .replace('https://', '')
  //         .replace('http://', '')
  //         .replace('www.', '');
  //       const portfolio = await prisma.portfolio.findFirst({
  //         where: { customDomain: domain },
  //       });
  //       await prisma.$disconnect();
  //       if (portfolio) return callback(null, true);
  //     } catch {
  //       // ignore
  //     }

  //     callback(new Error('Not allowed by CORS'));
  //   },
  //   credentials: true,
  // });
  app.enableCors({
    origin: (origin, callback) => {
      // قبل كل شي — لأن الـ custom domains غير محدودة
      callback(null, true);
    },
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('PortfolioCraft API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  // await app.listen(3001);
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
// {
//   "name": "Test User",
//   "email": "test@test.com",
//   "password": "12345678"
// }

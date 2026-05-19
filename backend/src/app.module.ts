import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { BillingModule } from './modules/billing/billing.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ExportModule } from './modules/export/export.module';
import { AdminModule } from './modules/admin/admin.module';
import { GalleryModule } from './modules/gallery/gallery.module';
import { ServicesModule } from './modules/services/services.module';
import { ClientsModule } from './modules/clients/clients.module';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { BlogModule } from './modules/blog/blog.module';
import { BookingModule } from './modules/booking/booking.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SubscriptionCheckerService } from './tasks/subscription-checker.service';
import { ConfigModule } from '@nestjs/config'; 
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'long',
        ttl: 3600000,
        limit: 1000,
      },
    ]),
    DatabaseModule,
    AuthModule,
    UsersModule,
    PortfolioModule,
    AnalyticsModule,
    BillingModule,
    MessagesModule,
    ExportModule,
    AdminModule,
    GalleryModule,
    ServicesModule,
    ClientsModule,
    AchievementsModule,
    BlogModule,
    BookingModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    SubscriptionCheckerService,
  ],
})
export class AppModule {}

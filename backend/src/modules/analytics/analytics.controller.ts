import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // @Post('event')
  // @ApiOperation({ summary: 'Track event (public)' })
  // trackEvent(@Body() body: { portfolioId: string; eventType: string; section?: string }) {
  //   return this.analyticsService.trackEvent(body.portfolioId, body)
  // }
  @Post('event')
  @Throttle({ short: { limit: 30, ttl: 60000 } }) // max 30 events per minute
  @ApiOperation({ summary: 'Track event (public)' })
  trackEvent(
    @Body() body: { portfolioId: string; eventType: string; section?: string },
  ) {
    return this.analyticsService.trackEvent(body.portfolioId, body);
  }
  @Get('mine/summary')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get analytics summary' })
  getSummary(@CurrentUser() user: any) {
    return this.analyticsService.getSummary(user.id);
  }

  @Get('mine/timeseries')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get views timeseries' })
  getTimeseries(@CurrentUser() user: any) {
    return this.analyticsService.getTimeseries(user.id);
  }
}

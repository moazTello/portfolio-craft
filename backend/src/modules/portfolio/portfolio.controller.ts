import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Portfolio')
@Controller('portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create portfolio' })
  create(@CurrentUser() user: any) {
    return this.portfolioService.create(user.id);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my portfolio' })
  findMine(@CurrentUser() user: any) {
    return this.portfolioService.findMine(user.id);
  }
  @Patch('mine/username')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update username' })
  updateUsername(@CurrentUser() user: any, @Body() body: { username: string }) {
    return this.portfolioService.updateUsername(user.id, body.username);
  }
  @Patch('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my portfolio' })
  update(@CurrentUser() user: any, @Body() dto: UpdatePortfolioDto) {
    return this.portfolioService.update(user.id, dto);
  }

  @Post('mine/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish portfolio' })
  publish(@CurrentUser() user: any) {
    return this.portfolioService.setPublished(user.id, true);
  }
  @Post('mine/unpublish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unpublish portfolio' })
  unpublish(@CurrentUser() user: any) {
    return this.portfolioService.setPublished(user.id, false);
  }
  @Get('public/:username')
  @ApiOperation({ summary: 'Get public portfolio' })
  findPublic(@Param('username') username: string) {
    return this.portfolioService.findPublic(username);
  }
  @Patch('mine/custom-domain')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set custom domain' })
  setCustomDomain(
    @CurrentUser() user: any,
    @Body() body: { domain: string | null },
  ) {
    return this.portfolioService.setCustomDomain(user.id, body.domain);
  }

  @Post('mine/verify-domain')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify custom domain DNS' })
  verifyDomain(@CurrentUser() user: any) {
    return this.portfolioService.verifyDomain(user.id);
  }

  @Get('by-domain/:domain')
  @ApiOperation({ summary: 'Find portfolio by custom domain' })
  findByDomain(@Param('domain') domain: string) {
    return this.portfolioService.findByDomain(domain);
  }

  @Get('public/all')
  @ApiOperation({ summary: 'Get all published portfolios for sitemap' })
  async findAllPublished() {
    return this.portfolioService.findAllPublished();
  }
}

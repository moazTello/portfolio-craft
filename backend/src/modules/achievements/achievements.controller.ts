import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AchievementsService } from './achievements.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CreateAchievementDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  date?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  imageUrl?: string;
}

@ApiTags('Achievements')
@Controller('portfolios/mine/achievements')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all achievements' })
  findAll(@CurrentUser() user: any) {
    return this.achievementsService.findAll(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create achievement' })
  create(@CurrentUser() user: any, @Body() dto: CreateAchievementDto) {
    return this.achievementsService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update achievement' })
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: CreateAchievementDto,
  ) {
    return this.achievementsService.update(user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete achievement' })
  delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.achievementsService.delete(user.id, id);
  }
}

import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { SkillsService } from './skills.service'
import { CreateSkillDto } from './dto/skill.dto'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../../common/decorators/current-user.decorator'

@ApiTags('Skills')
@Controller('portfolios/mine/skills')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all skills' })
  findAll(@CurrentUser() user: any) {
    return this.skillsService.findAll(user.id)
  }

  @Post()
  @ApiOperation({ summary: 'Create skill' })
  create(@CurrentUser() user: any, @Body() dto: CreateSkillDto) {
    return this.skillsService.create(user.id, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update skill' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: CreateSkillDto) {
    return this.skillsService.update(user.id, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete skill' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.skillsService.remove(user.id, id)
  }
}
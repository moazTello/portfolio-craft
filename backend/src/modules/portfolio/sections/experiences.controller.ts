import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ExperiencesService } from './experiences.service'
import { CreateExperienceDto } from './dto/experience.dto'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../../common/decorators/current-user.decorator'

@ApiTags('Experience')
@Controller('portfolios/mine/experiences')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all experiences' })
  findAll(@CurrentUser() user: any) {
    return this.experiencesService.findAll(user.id)
  }

  @Post()
  @ApiOperation({ summary: 'Create experience' })
  create(@CurrentUser() user: any, @Body() dto: CreateExperienceDto) {
    return this.experiencesService.create(user.id, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update experience' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: CreateExperienceDto) {
    return this.experiencesService.update(user.id, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete experience' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.experiencesService.remove(user.id, id)
  }
}
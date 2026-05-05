import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ProjectsService } from './projects.service'
import { CreateProjectDto } from './dto/project.dto'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../../common/decorators/current-user.decorator'

@ApiTags('Projects')
@Controller('portfolios/mine/projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  findAll(@CurrentUser() user: any) {
    return this.projectsService.findAll(user.id)
  }

  @Post()
  @ApiOperation({ summary: 'Create project' })
  create(@CurrentUser() user: any, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(user.id, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update project' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: CreateProjectDto) {
    return this.projectsService.update(user.id, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.projectsService.remove(user.id, id)
  }
}
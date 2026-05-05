import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { TestimonialsService } from './testimonials.service'
import { CreateTestimonialDto } from './dto/testimonial.dto'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../../common/decorators/current-user.decorator'

@ApiTags('Testimonials')
@Controller('portfolios/mine/testimonials')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all testimonials' })
  findAll(@CurrentUser() user: any) {
    return this.testimonialsService.findAll(user.id)
  }

  @Post()
  @ApiOperation({ summary: 'Create testimonial' })
  create(@CurrentUser() user: any, @Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.create(user.id, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update testimonial' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.update(user.id, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete testimonial' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.testimonialsService.remove(user.id, id)
  }
}
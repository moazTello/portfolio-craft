import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { GalleryService } from './gallery.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { IsString, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

class CreateGalleryDto {
  @ApiProperty()
  @IsString()
  imageUrl: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  caption?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category?: string
}

class ReorderDto {
  @ApiProperty()
  ids: string[]
}

@ApiTags('Gallery')
@Controller('gallery')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  @ApiOperation({ summary: 'Get my gallery' })
  findAll(@CurrentUser() user: any) {
    return this.galleryService.findAll(user.id)
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get gallery stats and limits' })
  getStats(@CurrentUser() user: any) {
    return this.galleryService.getStats(user.id)
  }

  @Post()
  @ApiOperation({ summary: 'Add image to gallery' })
  create(@CurrentUser() user: any, @Body() dto: CreateGalleryDto) {
    return this.galleryService.create(user.id, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update image caption/category' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: CreateGalleryDto) {
    return this.galleryService.update(user.id, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete image' })
  delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.galleryService.delete(user.id, id)
  }

  @Patch('reorder/all')
  @ApiOperation({ summary: 'Reorder images' })
  reorder(@CurrentUser() user: any, @Body() dto: ReorderDto) {
    return this.galleryService.reorder(user.id, dto.ids)
  }
}
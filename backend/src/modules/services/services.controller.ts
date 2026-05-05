import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ServicesService } from './services.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { IsString, IsOptional, IsBoolean } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

class CreateServiceDto {
  @ApiProperty()
  @IsString()
  title: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  iconUrl?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  price?: string

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  featured?: boolean
}

@ApiTags('Services')
@Controller('portfolios/mine/services')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  findAll(@CurrentUser() user: any) {
    return this.servicesService.findAll(user.id)
  }

  @Post()
  @ApiOperation({ summary: 'Create service' })
  create(@CurrentUser() user: any, @Body() dto: CreateServiceDto) {
    return this.servicesService.create(user.id, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update service' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: CreateServiceDto) {
    return this.servicesService.update(user.id, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete service' })
  delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.servicesService.delete(user.id, id)
  }
}
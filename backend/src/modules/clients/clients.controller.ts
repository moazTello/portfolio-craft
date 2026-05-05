import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { ClientsService } from './clients.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { IsString, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

class CreateClientDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  logoUrl?: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  websiteUrl?: string
}

@ApiTags('Clients')
@Controller('portfolios/mine/clients')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  findAll(@CurrentUser() user: any) {
    return this.clientsService.findAll(user.id)
  }

  @Post()
  @ApiOperation({ summary: 'Create client' })
  create(@CurrentUser() user: any, @Body() dto: CreateClientDto) {
    return this.clientsService.create(user.id, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update client' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: CreateClientDto) {
    return this.clientsService.update(user.id, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete client' })
  delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.clientsService.delete(user.id, id)
  }
}
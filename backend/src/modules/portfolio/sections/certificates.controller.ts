import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger'
import { CertificatesService } from './certificates.service'
import { CreateCertificateDto } from './dto/certificate.dto'
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../../common/decorators/current-user.decorator'

@ApiTags('Certificates')
@Controller('portfolios/mine/certificates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all certificates' })
  findAll(@CurrentUser() user: any) {
    return this.certificatesService.findAll(user.id)
  }

  @Post()
  @ApiOperation({ summary: 'Create certificate' })
  create(@CurrentUser() user: any, @Body() dto: CreateCertificateDto) {
    return this.certificatesService.create(user.id, dto)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update certificate' })
  update(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: CreateCertificateDto) {
    return this.certificatesService.update(user.id, id, dto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete certificate' })
  remove(@CurrentUser() user: any, @Param('id') id: string) {
    return this.certificatesService.remove(user.id, id)
  }
}
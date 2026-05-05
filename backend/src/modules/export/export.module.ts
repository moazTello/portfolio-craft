import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ExportController } from './export.controller'
import { ExportService } from './export.service'

@Module({
  imports: [ConfigModule],
  controllers: [ExportController],
  providers: [ExportService],
})
export class ExportModule {}
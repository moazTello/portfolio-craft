import { Module } from '@nestjs/common'
import { ClientsController } from './clients.controller'
import { ClientsService } from './clients.service'
import { UploadService } from '../../common/services/upload.service'
@Module({
  controllers: [ClientsController],
  providers: [ClientsService, UploadService],
})
export class ClientsModule {}
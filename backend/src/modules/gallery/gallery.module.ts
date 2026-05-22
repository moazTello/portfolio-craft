import { Module } from '@nestjs/common'
import { GalleryController } from './gallery.controller'
import { GalleryService } from './gallery.service'
import { UploadService } from '../../common/services/upload.service'
@Module({
  controllers: [GalleryController],
  providers: [GalleryService, UploadService],
  exports: [GalleryService],
})
export class GalleryModule {}
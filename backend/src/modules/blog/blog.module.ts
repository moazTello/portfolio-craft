import { Module } from '@nestjs/common';
import { BlogController, BlogPublicController } from './blog.controller';
import { BlogService } from './blog.service';
import { UploadService } from '../../common/services/upload.service';

@Module({
  controllers: [BlogController, BlogPublicController],
  providers: [BlogService, UploadService],
})
export class BlogModule {}

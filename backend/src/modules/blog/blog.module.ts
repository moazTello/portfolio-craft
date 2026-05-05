import { Module } from '@nestjs/common'
import { BlogController, BlogPublicController } from './blog.controller'
import { BlogService } from './blog.service'

@Module({
  controllers: [BlogController, BlogPublicController],
  providers: [BlogService],
})
export class BlogModule {}
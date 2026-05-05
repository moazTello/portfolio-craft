import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CreateBlogPostDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  published?: boolean; // ← تأكد موجود
}

// ─── Dashboard Routes ────────────────────────────────────

@ApiTags('Blog')
@Controller('blog')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({ summary: 'Get all my posts' })
  findAll(@CurrentUser() user: any) {
    return this.blogService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single post for editing' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.blogService.findOne(user.id, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create blog post' })
  create(@CurrentUser() user: any, @Body() dto: CreateBlogPostDto) {
    return this.blogService.create(user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update blog post' })
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: CreateBlogPostDto,
  ) {
    return this.blogService.update(user.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete blog post' })
  delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.blogService.delete(user.id, id);
  }
}

// ─── Public Routes ───────────────────────────────────────

@ApiTags('Blog Public')
@Controller('public/blog')
export class BlogPublicController {
  constructor(private readonly blogService: BlogService) {}

  @Get(':username')
  @ApiOperation({ summary: 'Get published posts by portfolio username' })
  findByUsername(@Param('username') username: string) {
    return this.blogService.findPublicByUsername(username);
  }

  @Get(':username/:slug')
  @ApiOperation({ summary: 'Get single published post' })
  findPost(@Param('username') username: string, @Param('slug') slug: string) {
    return this.blogService.findPublicPost(username, slug);
  }
}

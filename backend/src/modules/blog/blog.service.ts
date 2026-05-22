import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UploadService } from '../../common/services/upload.service';
@Injectable()
export class BlogService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}
  // ─── Private helpers ───────────────────────────────────
  private slugify(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-');
  }
  private async uniqueSlug(userId: string, base: string): Promise<string> {
    let slug = base;
    let i = 1;
    while (
      await this.prisma.blogPost.findUnique({
        where: { userId_slug: { userId, slug } },
      })
    ) {
      slug = `${base}-${i++}`;
    }
    return slug;
  }
  private calcReadTime(content: string): number {
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }
  // ─── Dashboard (authenticated) ─────────────────────────
  async findAll(userId: string) {
    return this.prisma.blogPost.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        published: true,
        publishedAt: true,
        readTime: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
  async findOne(userId: string, id: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { id, userId },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(
    userId: string,
    data: {
      title?: string;
      content?: string;
      excerpt?: string;
      coverImage?: string;
      tags?: string[];
      published?: boolean;
    },
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.plan === 'FREE') {
      throw new ForbiddenException(
        'Blog is available on Pro and Business plans only',
      );
    }

    if (!data.title) throw new Error('Title is required');
    if (!data.content) throw new Error('Content is required');

    // ارفع الـ cover image على Cloudinary
    let coverImage = data.coverImage;
    if (data.coverImage?.startsWith('data:')) {
      coverImage = await this.uploadService.uploadImage(
        data.coverImage,
        'portfoliocraft/blog',
      );
    }

    const baseSlug = this.slugify(data.title);
    const slug = await this.uniqueSlug(userId, baseSlug);
    const readTime = this.calcReadTime(data.content);

    return this.prisma.blogPost.create({
      data: {
        userId,
        slug,
        readTime,
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        coverImage,
        tags: data.tags ?? [],
        published: data.published ?? false,
        publishedAt: data.published ? new Date() : null,
      },
    });
  }

  async update(
    userId: string,
    id: string,
    data: {
      title?: string;
      content?: string;
      excerpt?: string;
      coverImage?: string;
      tags?: string[];
      published?: boolean;
    },
  ) {
    const post = await this.prisma.blogPost.findFirst({
      where: { id, userId },
    });
    if (!post) throw new NotFoundException('Post not found');

    // ارفع الـ cover image الجديدة على Cloudinary
    let coverImage = data.coverImage;
    if (data.coverImage?.startsWith('data:')) {
      // احذف القديمة
      if (post.coverImage)
        await this.uploadService.deleteImage(post.coverImage);
      // ارفع الجديدة
      coverImage = await this.uploadService.uploadImage(
        data.coverImage,
        'portfoliocraft/blog',
      );
    }

    const updateData: any = { ...data, ...(coverImage && { coverImage }) };
    if (data.content) updateData.readTime = this.calcReadTime(data.content);
    if (data.published === true && !post.published) {
      updateData.publishedAt = new Date();
    } else if (data.published === false) {
      updateData.publishedAt = null;
    }

    return this.prisma.blogPost.update({ where: { id }, data: updateData });
  }

  async delete(userId: string, id: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { id, userId },
    });
    if (!post) throw new NotFoundException('Post not found');

    // احذف الـ cover image من Cloudinary
    if (post.coverImage) await this.uploadService.deleteImage(post.coverImage);

    return this.prisma.blogPost.delete({ where: { id } });
  }

  async findPublicByUsername(username: string) {
    const user = await this.prisma.user.findFirst({
      where: { portfolio: { username } },
    });
    if (!user) throw new NotFoundException('User not found');

    // تحقق من الخطة
    const isPro = user.plan === 'PRO' || user.plan === 'BUSINESS';
    if (!isPro) throw new NotFoundException('Blog not available');

    return this.prisma.blogPost.findMany({
      where: { userId: user.id, published: true },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        tags: true,
        readTime: true,
        publishedAt: true,
      },
    });
  }
  async findPublicPost(username: string, slug: string) {
    const user = await this.prisma.user.findFirst({
      where: { portfolio: { username } },
    });
    if (!user) throw new NotFoundException('User not found');
    const post = await this.prisma.blogPost.findUnique({
      where: {
        userId_slug: { userId: user.id, slug },
      },
    });
    if (!post || !post.published) throw new NotFoundException('Post not found');
    return post;
  }
}

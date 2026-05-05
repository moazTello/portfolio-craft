import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PrismaService } from '../../database/prisma.service';
import { TelegramService } from './telegram.service';

class SendMessageDto {
  @ApiProperty()
  @IsString()
  portfolioId: string

  @ApiProperty()
  @IsString()
  senderName: string

  @ApiProperty()
  @IsEmail()
  senderEmail: string

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  subject?: string

  @ApiProperty()
  @IsString()
  content: string
}

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  // constructor(private readonly messagesService: MessagesService) {}
  constructor(
    private readonly messagesService: MessagesService,
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService,
  ) {}

  @Post('send')
  @ApiOperation({ summary: 'Send message to portfolio owner (public)' })
  send(@Body() dto: SendMessageDto) {
    return this.messagesService.send(dto.portfolioId, dto);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all received messages' })
  findAll(@CurrentUser() user: any) {
    return this.messagesService.findAll(user.id);
  }

  @Get('mine/unread')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get unread count' })
  unreadCount(@CurrentUser() user: any) {
    return this.messagesService.getUnreadCount(user.id);
  }

  @Patch('mine/:id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark message as read' })
  markRead(@CurrentUser() user: any, @Param('id') id: string) {
    return this.messagesService.markRead(user.id, id);
  }

  @Delete('mine/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete message' })
  delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.messagesService.delete(user.id, id);
  }

  @Post('test-telegram')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test telegram notification' })
  async testTelegram(@CurrentUser() user: any) {
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!dbUser?.telegramChatId) {
      throw new BadRequestException('No Telegram Chat ID set');
    }
    await this.telegram.sendMessage(
      dbUser.telegramChatId,
      '✅ <b>PortfolioCraft</b>\n\nYour Telegram notifications are working!',
    );
    return { success: true };
  }
}

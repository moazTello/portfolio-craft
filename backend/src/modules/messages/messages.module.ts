import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MessagesController } from './messages.controller'
import { MessagesService } from './messages.service'
import { EmailModule } from '../email/email.module'
import { TelegramService } from './telegram.service'
import { PrismaService } from 'src/database/prisma.service'
@Module({
  imports: [EmailModule, ConfigModule],
  controllers: [MessagesController],
  providers: [MessagesService, TelegramService, PrismaService],
})
export class MessagesModule {}